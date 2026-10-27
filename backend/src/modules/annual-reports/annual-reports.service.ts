import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ContentStatus } from '../../common/enums/content-status.enum';
import {
  buildPaginatedResult,
  PaginatedResult,
} from '../../common/interfaces/paginated.interface';
import { CdnFile, CdnService } from '../../common/storage/cdn.service';
import {
  applyDeletedFilter,
  restoreSoftDeleted,
} from '../../common/utils/soft-delete';
import { AnnualReportQueryDto } from './dto/annual-report-query.dto';
import { CreateAnnualReportDto } from './dto/create-annual-report.dto';
import { UpdateAnnualReportDto } from './dto/update-annual-report.dto';
import { AnnualReport } from './entities/annual-report.entity';

const CDN_FOLDER = 'annual-reports';

@Injectable()
export class AnnualReportsService {
  private readonly logger = new Logger(AnnualReportsService.name);

  constructor(
    @InjectRepository(AnnualReport)
    private readonly repo: Repository<AnnualReport>,
    private readonly cdn: CdnService,
  ) {}

  async create(
    dto: CreateAnnualReportDto,
    file?: CdnFile,
  ): Promise<AnnualReport> {
    if (!file) {
      throw new BadRequestException('Annual report file is required.');
    }

    const fileUrl = await this.cdn.upload(file, CDN_FOLDER, 'document');

    try {
      const entity = this.repo.create({
        ...dto,
        fileUrl,
        status: dto.status ?? ContentStatus.DRAFT,
        sortOrder: dto.sortOrder ?? 0,
      });
      const saved = await this.repo.save(entity);
      this.logger.log(`Created annual report with ID ${saved.id}`);
      return saved;
    } catch (err) {
      await this.cdn.delete(fileUrl);
      throw err;
    }
  }

  async findAll(
    query: AnnualReportQueryDto,
  ): Promise<PaginatedResult<AnnualReport>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const qb = this.repo
      .createQueryBuilder('entity')
      .orderBy('entity.sortOrder', 'ASC')
      .addOrderBy('entity.reportYear', 'DESC')
      .addOrderBy('entity.createdAt', 'DESC');

    applyDeletedFilter(qb, query);

    if (query.status) {
      qb.andWhere('entity.status = :status', { status: query.status });
    }

    if (query.reportYear) {
      qb.andWhere('entity.reportYear = :reportYear', {
        reportYear: query.reportYear,
      });
    }

    if (query.search) {
      qb.andWhere(
        '(entity.title ILIKE :search OR entity.reportYear ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return buildPaginatedResult(data, total, page, limit);
  }

  async findPublished(): Promise<AnnualReport[]> {
    return this.repo.find({
      where: { status: ContentStatus.PUBLISHED },
      order: { sortOrder: 'ASC', reportYear: 'DESC', createdAt: 'DESC' },
    });
  }

  async findDeleted(
    query: PaginationQueryDto,
  ): Promise<PaginatedResult<AnnualReport>> {
    return this.findAll({ ...query, includeDeleted: true, onlyDeleted: true });
  }

  async findOne(id: string): Promise<AnnualReport> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(
        `Annual report not found for id "${id}". Check the id and try again.`,
      );
    }
    return entity;
  }

  async update(
    id: string,
    dto: UpdateAnnualReportDto,
    file?: CdnFile,
  ): Promise<AnnualReport> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);

    if (file) {
      entity.fileUrl =
        (await this.cdn.replace(entity.fileUrl, file, CDN_FOLDER, 'document')) ??
        entity.fileUrl;
      this.logger.log(
        `Replaced CDN file for annual report ID ${id}: new URL is ${entity.fileUrl}`,
      );
    }

    return await this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.softRemove(entity);
    this.logger.log(`Soft-deleted annual report with ID ${id}`);
  }

  async restore(id: string): Promise<AnnualReport> {
    return restoreSoftDeleted(this.repo, id, 'Annual report');
  }
}
