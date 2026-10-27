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
import { CreatePartnershipInquiryDto } from './dto/create-partnership-inquiry.dto';
import { UpdatePartnershipInquiryDto } from './dto/update-partnership-inquiry.dto';
import { PartnershipInquiry } from './entities/partnership-inquiry.entity';

@Injectable()
export class PartnershipInquiriesService {
  private readonly logger = new Logger(PartnershipInquiriesService.name);

  constructor(
    @InjectRepository(PartnershipInquiry)
    private readonly repo: Repository<PartnershipInquiry>,
  ) {}

  async create(dto: CreatePartnershipInquiryDto): Promise<PartnershipInquiry> {
    const entity = this.repo.create(dto);
    const saved = await this.repo.save(entity);
    this.logger.log(`Created new partnership inquiry with ID ${saved.id}`);
    return saved;
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResponse<PartnershipInquiry>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const qb = this.repo
      .createQueryBuilder('entity')
      .orderBy('entity.createdAt', 'DESC');
    applyDeletedFilter(qb, query);

    if (query.search) {
      qb.andWhere(
        '(entity.yourName ILIKE :search OR entity.orgName ILIKE :search OR entity.phone ILIKE :search OR entity.partnershipType::text ILIKE :search OR entity.proposal ILIKE :search)',
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
  ): Promise<PaginatedResponse<PartnershipInquiry>> {
    return this.findAll({ ...query, includeDeleted: true, onlyDeleted: true });
  }

  async findOne(id: string): Promise<PartnershipInquiry> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(
        `Partnership inquiry not found for id "${id}". Check the id and try again.`,
      );
    }
    return entity;
  }

  async update(
    id: string,
    dto: UpdatePartnershipInquiryDto,
  ): Promise<PartnershipInquiry> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return await this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.softRemove(entity);
    this.logger.log(`Soft-deleted partnership inquiry with ID ${id}`);
  }

  async restore(id: string): Promise<PartnershipInquiry> {
    return restoreSoftDeleted(this.repo, id, 'Partnership inquiry');
  }
}
