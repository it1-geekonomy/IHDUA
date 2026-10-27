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
import { CreateOrganizationalDocumentDto } from './dto/create-organizational-document.dto';
import { UpdateOrganizationalDocumentDto } from './dto/update-organizational-document.dto';
import { OrganizationalDocument } from './entities/organizational-document.entity';

const CDN_FOLDER = 'organizational-documents';

@Injectable()
export class OrganizationalDocumentsService {
  private readonly logger = new Logger(OrganizationalDocumentsService.name);

  constructor(
    @InjectRepository(OrganizationalDocument)
    private readonly repo: Repository<OrganizationalDocument>,
    private readonly cdn: CdnService,
  ) {}

  async create(
    dto: CreateOrganizationalDocumentDto,
    file?: CdnFile,
  ): Promise<OrganizationalDocument> {
    if (!file) {
      throw new BadRequestException('Document file is required.');
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
      this.logger.log(`Created organizational document with ID ${saved.id}`);
      return saved;
    } catch (err) {
      await this.cdn.delete(fileUrl);
      throw err;
    }
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResult<OrganizationalDocument>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const qb = this.repo
      .createQueryBuilder('entity')
      .orderBy('entity.sortOrder', 'ASC')
      .addOrderBy('entity.createdAt', 'DESC');

    applyDeletedFilter(qb, query);

    if (query.status) {
      qb.andWhere('entity.status = :status', { status: query.status });
    }

    if (query.search) {
      qb.andWhere('entity.title ILIKE :search', {
        search: `%${query.search}%`,
      });
    }

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return buildPaginatedResult(data, total, page, limit);
  }

  async findPublished(): Promise<OrganizationalDocument[]> {
    return this.repo.find({
      where: { status: ContentStatus.PUBLISHED },
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  async findDeleted(
    query: PaginationQueryDto,
  ): Promise<PaginatedResult<OrganizationalDocument>> {
    return this.findAll({ ...query, includeDeleted: true, onlyDeleted: true });
  }

  async findOne(id: string): Promise<OrganizationalDocument> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(
        `Organizational document not found for id "${id}". Check the id and try again.`,
      );
    }
    return entity;
  }

  async update(
    id: string,
    dto: UpdateOrganizationalDocumentDto,
    file?: CdnFile,
  ): Promise<OrganizationalDocument> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);

    if (file) {
      entity.fileUrl =
        (await this.cdn.replace(entity.fileUrl, file, CDN_FOLDER, 'document')) ??
        entity.fileUrl;
      this.logger.log(
        `Replaced CDN file for organizational document ID ${id}: new URL is ${entity.fileUrl}`,
      );
    }

    return await this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.softRemove(entity);
    this.logger.log(`Soft-deleted organizational document with ID ${id}`);
  }

  async restore(id: string): Promise<OrganizationalDocument> {
    return restoreSoftDeleted(this.repo, id, 'Organizational document');
  }
}
