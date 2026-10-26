import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import {
  buildPaginatedResult,
  PaginatedResponse,
} from '../../common/interfaces/paginated.interface';
import {
  applyDeletedFilter,
  restoreSoftDeleted,
} from '../../common/utils/soft-delete';
import { CreateLeadContactDto } from './dto/create-lead-contact.dto';
import { UpdateLeadContactDto } from './dto/update-lead-contact.dto';
import { LeadContact } from './entities/lead-contact.entity';

@Injectable()
export class LeadsContactService {
  private readonly logger = new Logger(LeadsContactService.name);

  constructor(
    @InjectRepository(LeadContact)
    private readonly repo: Repository<LeadContact>,
  ) {}

  async create(dto: CreateLeadContactDto): Promise<LeadContact> {
    const entity = this.repo.create(dto);
    const saved = await this.repo.save(entity);
    this.logger.log(`Created new contact lead inquiry with ID ${saved.id}`);
    return saved;
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResponse<LeadContact>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const qb = this.repo
      .createQueryBuilder('entity')
      .orderBy('entity.createdAt', 'DESC');
    applyDeletedFilter(qb, query);

    if (query.search) {
      qb.andWhere(
        '(entity.name ILIKE :search OR entity.email ILIKE :search OR entity.mobile ILIKE :search OR entity.subject ILIKE :search OR entity.message ILIKE :search)',
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
  ): Promise<PaginatedResponse<LeadContact>> {
    return this.findAll({ ...query, includeDeleted: true, onlyDeleted: true });
  }

  async findOne(id: string): Promise<LeadContact> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(
        `Contact lead not found for id "${id}". Check the id and try again.`,
      );
    }
    return entity;
  }

  async update(
    id: string,
    dto: UpdateLeadContactDto,
  ): Promise<LeadContact> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return await this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.softRemove(entity);
    this.logger.log(`Soft-deleted contact lead with ID ${id}`);
  }

  async restore(id: string): Promise<LeadContact> {
    return restoreSoftDeleted(this.repo, id, 'Contact lead');
  }
}
