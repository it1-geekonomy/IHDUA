import {
  ConflictException,
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
import {
  applyDeletedFilter,
  restoreSoftDeleted,
} from '../../common/utils/soft-delete';
import { CreateFundingProjectDto } from './dto/create-funding-project.dto';
import { UpdateFundingProjectDto } from './dto/update-funding-project.dto';
import { FundingProject } from './entities/funding-project.entity';

@Injectable()
export class FundingProjectsService {
  private readonly logger = new Logger(FundingProjectsService.name);

  constructor(
    @InjectRepository(FundingProject)
    private readonly repo: Repository<FundingProject>,
  ) {}

  async create(dto: CreateFundingProjectDto): Promise<FundingProject> {
    await this.assertSlugAvailable(dto.slug);
    const entity = this.repo.create({
      ...dto,
      highlights: dto.highlights ?? [],
      components: dto.components ?? [],
      sortOrder: dto.sortOrder ?? 0,
      status: dto.status ?? ContentStatus.DRAFT,
    });
    const saved = await this.repo.save(entity);
    this.logger.log(`Created funding project ${saved.slug} (${saved.id})`);
    return saved;
  }

  async findPublished(): Promise<FundingProject[]> {
    return this.repo.find({
      where: { status: ContentStatus.PUBLISHED },
      order: { sortOrder: 'ASC', projectNumber: 'ASC', createdAt: 'ASC' },
    });
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResult<FundingProject>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const qb = this.repo
      .createQueryBuilder('entity')
      .orderBy('entity.sortOrder', 'ASC')
      .addOrderBy('entity.projectNumber', 'ASC')
      .addOrderBy('entity.createdAt', 'ASC');

    applyDeletedFilter(qb, query);

    if (query.status) {
      qb.andWhere('entity.status = :status', { status: query.status });
    }

    if (query.search) {
      qb.andWhere(
        '(entity.title ILIKE :search OR entity.slug ILIKE :search OR entity.cause ILIKE :search OR entity.totalLabel ILIKE :search)',
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
  ): Promise<PaginatedResult<FundingProject>> {
    return this.findAll({ ...query, includeDeleted: true, onlyDeleted: true });
  }

  async findOne(id: string): Promise<FundingProject> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Funding project not found for id "${id}".`);
    }
    return entity;
  }

  async update(
    id: string,
    dto: UpdateFundingProjectDto,
  ): Promise<FundingProject> {
    const entity = await this.findOne(id);
    if (dto.slug && dto.slug !== entity.slug) {
      await this.assertSlugAvailable(dto.slug, id);
    }
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.softRemove(entity);
    this.logger.log(`Soft-deleted funding project ${id}`);
  }

  async restore(id: string): Promise<FundingProject> {
    return restoreSoftDeleted(this.repo, id, 'FundingProject');
  }

  private async assertSlugAvailable(slug: string, excludeId?: string) {
    const existing = await this.repo.findOne({
      where: { slug },
      withDeleted: true,
    });
    if (existing && existing.id !== excludeId) {
      throw new ConflictException(`Slug "${slug}" is already in use.`);
    }
  }
}
