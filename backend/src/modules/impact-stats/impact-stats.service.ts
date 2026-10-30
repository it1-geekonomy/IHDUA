import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import {
  buildPaginatedResult,
  PaginatedResult,
} from '../../common/interfaces/paginated.interface';
import {
  applyDeletedFilter,
  restoreSoftDeleted,
} from '../../common/utils/soft-delete';
import { CreateImpactStatDto } from './dto/create-impact-stat.dto';
import { UpdateImpactStatDto } from './dto/update-impact-stat.dto';
import { ImpactStat } from './entities/impact-stat.entity';

@Injectable()
export class ImpactStatsService {
  private readonly logger = new Logger(ImpactStatsService.name);

  constructor(
    @InjectRepository(ImpactStat)
    private readonly repo: Repository<ImpactStat>,
  ) {}

  async create(dto: CreateImpactStatDto): Promise<ImpactStat> {
    const entity = this.repo.create(dto);
    const saved = await this.repo.save(entity);
    this.logger.log(`Created new impact stat "${saved.metricName}" with ID ${saved.id}`);
    return saved;
  }

  /**
   * Public endpoint helper: Get all active impact stats for the website cards
   * Ordered by card position (first, second, third, fourth) and recently created first within each position
   */
  async findPublic(): Promise<ImpactStat[]> {
    return this.repo.find({
      order: {
        cardPosition: 'ASC',
        createdAt: 'DESC',
      },
    });
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResult<ImpactStat>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const qb = this.repo
      .createQueryBuilder('entity')
      .orderBy('entity.cardPosition', 'ASC')
      .addOrderBy('entity.createdAt', 'DESC');

    applyDeletedFilter(qb, query);

    if (query.search) {
      qb.andWhere(
        '(entity.metricName ILIKE :search OR entity.metricValue ILIKE :search)',
        {
          search: `%${query.search}%`,
        },
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
  ): Promise<PaginatedResult<ImpactStat>> {
    return this.findAll({ ...query, includeDeleted: true, onlyDeleted: true });
  }

  async findOne(id: string): Promise<ImpactStat> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(
        `Impact stat not found for id "${id}". Check the id and try again.`,
      );
    }
    return entity;
  }

  async update(id: string, dto: UpdateImpactStatDto): Promise<ImpactStat> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    const saved = await this.repo.save(entity);
    this.logger.log(`Updated impact stat with ID ${id}`);
    return saved;
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.softRemove(entity);
    this.logger.log(`Soft-deleted impact stat with ID ${id}`);
  }

  async restore(id: string): Promise<ImpactStat> {
    return restoreSoftDeleted(this.repo, id, 'Impact stat');
  }
}
