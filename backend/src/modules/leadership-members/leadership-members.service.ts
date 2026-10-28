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
import { CreateLeadershipMemberDto } from './dto/create-leadership-member.dto';
import { LeadershipMemberQueryDto } from './dto/leadership-member-query.dto';
import { UpdateLeadershipMemberDto } from './dto/update-leadership-member.dto';
import { LeadershipMember } from './entities/leadership-member.entity';

const CDN_FOLDER = 'leadership-members';

@Injectable()
export class LeadershipMembersService {
  private readonly logger = new Logger(LeadershipMembersService.name);

  constructor(
    @InjectRepository(LeadershipMember)
    private readonly repo: Repository<LeadershipMember>,
    private readonly cdn: CdnService,
  ) {}

  async create(
    dto: CreateLeadershipMemberDto,
    file?: CdnFile,
  ): Promise<LeadershipMember> {
    let photoUrl = dto.photoUrl;

    if (file) {
      photoUrl = await this.cdn.upload(file, CDN_FOLDER, 'image');
    }

    if (!photoUrl) {
      throw new BadRequestException('Member photo is required.');
    }

    try {
      const entity = this.repo.create({
        ...dto,
        photoUrl,
        status: dto.status ?? ContentStatus.DRAFT,
        sortOrder: dto.sortOrder ?? 0,
      });
      const saved = await this.repo.save(entity);
      this.logger.log(`Created leadership member with ID ${saved.id}`);
      return saved;
    } catch (err) {
      if (file && photoUrl) {
        await this.cdn.delete(photoUrl);
      }
      throw err;
    }
  }

  async findAll(
    query: LeadershipMemberQueryDto,
  ): Promise<PaginatedResult<LeadershipMember>> {
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
      qb.andWhere(
        '(entity.name ILIKE :search OR entity.designation ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return buildPaginatedResult(data, total, page, limit);
  }

  async findPublished(): Promise<LeadershipMember[]> {
    return this.repo.find({
      where: { status: ContentStatus.PUBLISHED },
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  async findDeleted(
    query: PaginationQueryDto,
  ): Promise<PaginatedResult<LeadershipMember>> {
    return this.findAll({ ...query, includeDeleted: true, onlyDeleted: true });
  }

  async findOne(id: string): Promise<LeadershipMember> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(
        `Leadership member not found for id "${id}". Check the id and try again.`,
      );
    }
    return entity;
  }

  async update(
    id: string,
    dto: UpdateLeadershipMemberDto,
    file?: CdnFile,
  ): Promise<LeadershipMember> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);

    if (file) {
      entity.photoUrl =
        (await this.cdn.replace(entity.photoUrl, file, CDN_FOLDER, 'image')) ??
        entity.photoUrl;
      this.logger.log(
        `Replaced CDN photo for leadership member ID ${id}: new URL is ${entity.photoUrl}`,
      );
    }

    return await this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.softRemove(entity);
    this.logger.log(`Soft-deleted leadership member with ID ${id}`);
  }

  async restore(id: string): Promise<LeadershipMember> {
    return restoreSoftDeleted(this.repo, id, 'Leadership member');
  }
}
