import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import {
  buildPaginatedResult,
  PaginatedResponse,
} from '../../common/interfaces/paginated.interface';
import { CdnFile, CdnService } from '../../common/storage/cdn.service';
import {
  applyDeletedFilter,
  restoreSoftDeleted,
} from '../../common/utils/soft-delete';
import { CreateLeadVolunteerDto } from './dto/create-lead-volunteer.dto';
import { UpdateLeadVolunteerDto } from './dto/update-lead-volunteer.dto';
import { LeadVolunteer } from './entities/lead-volunteer.entity';

const CDN_FOLDER = 'leads-volunteer';

@Injectable()
export class LeadsVolunteerService {
  private readonly logger = new Logger(LeadsVolunteerService.name);

  constructor(
    @InjectRepository(LeadVolunteer)
    private readonly repo: Repository<LeadVolunteer>,
    private readonly cdn: CdnService,
  ) {}

  async create(
    dto: CreateLeadVolunteerDto,
    file?: CdnFile,
  ): Promise<LeadVolunteer> {
    if (!file) {
      throw new BadRequestException('Resume file is required.');
    }

    const resumeUrl = await this.cdn.upload(file, CDN_FOLDER, 'cv');

    try {
      const entity = this.repo.create({ ...dto, resumeUrl });
      const saved = await this.repo.save(entity);
      this.logger.log(`Created new volunteer lead inquiry with ID ${saved.id}`);
      return saved;
    } catch (err) {
      await this.cdn.delete(resumeUrl);
      throw err;
    }
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResponse<LeadVolunteer>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const qb = this.repo
      .createQueryBuilder('entity')
      .orderBy('entity.createdAt', 'DESC');
    applyDeletedFilter(qb, query);

    if (query.search) {
      qb.andWhere(
        '(entity.fullName ILIKE :search OR entity.email ILIKE :search OR entity.phone ILIKE :search OR entity.areaOfInterest ILIKE :search OR entity.skills ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return buildPaginatedResult(data, total, page, limit);
  }

  async findDeleted(
    query: PaginationQueryDto,
  ): Promise<PaginatedResponse<LeadVolunteer>> {
    return this.findAll({ ...query, includeDeleted: true, onlyDeleted: true });
  }

  async findOne(id: string): Promise<LeadVolunteer> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(
        `Volunteer lead not found for id "${id}". Check the id and try again.`,
      );
    }
    return entity;
  }

  async update(
    id: string,
    dto: UpdateLeadVolunteerDto,
    file?: CdnFile,
  ): Promise<LeadVolunteer> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);

    if (file) {
      entity.resumeUrl =
        (await this.cdn.replace(entity.resumeUrl, file, CDN_FOLDER, 'cv')) ??
        entity.resumeUrl;
    }

    return await this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.softRemove(entity);
    this.logger.log(`Soft-deleted volunteer lead with ID ${id}`);
  }

  async restore(id: string): Promise<LeadVolunteer> {
    return restoreSoftDeleted(this.repo, id, 'Volunteer lead');
  }
}
