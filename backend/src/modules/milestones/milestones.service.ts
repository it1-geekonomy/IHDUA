import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { Milestone } from './entities/milestone.entity';

@Injectable()
export class MilestonesService {
  private readonly logger = new Logger(MilestonesService.name);

  constructor(
    @InjectRepository(Milestone)
    private readonly repo: Repository<Milestone>,
  ) {}

  async create(dto: CreateMilestoneDto): Promise<Milestone> {
    const entity = this.repo.create({
      ...dto,
      status: dto.status ?? ContentStatus.DRAFT,
    });
    const saved = await this.repo.save(entity);
    this.logger.log(`Created new milestone for year ${saved.year} with ID ${saved.id}`);
    return saved;
  }

  /**
   * Public endpoint helper: Get all published milestones sorted year-wise (chronological ASC)
   */
  async findYearWise(): Promise<Milestone[]> {
    return this.repo.find({
      where: {
        status: ContentStatus.PUBLISHED,
      },
      order: {
        year: 'ASC',
        createdAt: 'ASC',
      },
    });
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResult<Milestone>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const qb = this.repo
      .createQueryBuilder('entity')
      .orderBy('entity.year', 'ASC')
      .addOrderBy('entity.createdAt', 'ASC');

    applyDeletedFilter(qb, query);

    if (query.status) {
      qb.andWhere('entity.status = :status', { status: query.status });
    }

    if (query.search) {
      qb.andWhere(
        '(entity.year ILIKE :search OR entity.description ILIKE :search)',
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
  ): Promise<PaginatedResult<Milestone>> {
    return this.findAll({ ...query, includeDeleted: true, onlyDeleted: true });
  }

  async findOne(id: string): Promise<Milestone> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(
        `Milestone not found for id "${id}". Check the id and try again.`,
      );
    }
    return entity;
  }

  async update(id: string, dto: UpdateMilestoneDto): Promise<Milestone> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return await this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.softRemove(entity);
    this.logger.log(`Soft-deleted milestone with ID ${id}`);
  }

  async restore(id: string): Promise<Milestone> {
    return restoreSoftDeleted(this.repo, id, 'Milestone');
  }
}
