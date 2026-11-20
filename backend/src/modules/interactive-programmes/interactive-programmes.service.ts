import {
  Injectable,
  Logger,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatbotSyncService } from '../../common/chatbot-sync/chatbot-sync.service';
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
import { CreateInteractiveProgrammeDto } from './dto/create-interactive-programme.dto';
import { UpdateInteractiveProgrammeDto } from './dto/update-interactive-programme.dto';
import { InteractiveProgramme } from './entities/interactive-programme.entity';

const CDN_FOLDER = 'interactive-programmes';

/** Public list card — no content (use GET slug/:slug for full detail). */
export type InteractiveProgrammePublishedListItem = {
  id: string;
  slug: string;
  title: string;
  eventMediaUrl: string | null;
  eventDate: string | null;
  eventLocation: string | null;
  eventTime: string | null;
  status: ContentStatus;
};

const PUBLISHED_LIST_COLUMNS = [
  'id',
  'slug',
  'title',
  'eventMediaUrl',
  'eventDate',
  'eventLocation',
  'eventTime',
  'status',
] as const;

export interface InteractiveProgrammeFiles {
  eventMedia?: CdnFile[];
}

function mediaKind(file: CdnFile): 'image' | 'video' {
  return file.mimetype.startsWith('video/') ? 'video' : 'image';
}

@Injectable()
export class InteractiveProgrammesService {
  private readonly logger = new Logger(InteractiveProgrammesService.name);

  constructor(
    @InjectRepository(InteractiveProgramme)
    private readonly repo: Repository<InteractiveProgramme>,
    private readonly cdn: CdnService,
    private readonly chatbotSync: ChatbotSyncService,
  ) {}

  async create(
    dto: CreateInteractiveProgrammeDto,
    files?: InteractiveProgrammeFiles,
  ): Promise<InteractiveProgramme> {
    await this.assertSlugAvailable(dto.slug);

    const mediaFile = files?.eventMedia?.[0];
    let eventMediaUrl = dto.eventMediaUrl ?? null;

    if (mediaFile) {
      eventMediaUrl = await this.cdn.upload(
        mediaFile,
        CDN_FOLDER,
        mediaKind(mediaFile),
      );
    }

    try {
      const entity = this.repo.create({
        title: dto.title,
        slug: dto.slug,
        eventMediaUrl,
        eventDate: dto.eventDate ?? null,
        eventLocation: dto.eventLocation ?? null,
        eventTime: dto.eventTime ?? null,
        content: dto.content ?? null,
        status: dto.status ?? ContentStatus.DRAFT,
      });
      const saved = await this.repo.save(entity);
      this.logger.log(
        `Created interactive programme ${saved.slug} (${saved.id})`,
      );
      this.chatbotSync.notify('interactive_programmes', saved.id);
      this.chatbotSync.notify('interactive_programmes_index', 'all');
      return saved;
    } catch (err) {
      if (mediaFile && eventMediaUrl) {
        await this.cdn.delete(eventMediaUrl);
      }
      throw err;
    }
  }

  async findPublished(
    query: PaginationQueryDto = {},
  ): Promise<PaginatedResult<InteractiveProgrammePublishedListItem>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const qb = this.repo
      .createQueryBuilder('entity')
      .select(PUBLISHED_LIST_COLUMNS.map((column) => `entity.${column}`))
      .where('entity.status = :status', { status: ContentStatus.PUBLISHED })
      .orderBy('entity.eventDate', 'ASC', 'NULLS LAST')
      .addOrderBy('entity.createdAt', 'DESC');

    if (query.search) {
      qb.andWhere(
        '(entity.title ILIKE :search OR entity.slug ILIKE :search OR entity.eventLocation ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    const total = await qb.clone().getCount();
    const entities = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const data: InteractiveProgrammePublishedListItem[] = entities.map(
      (entity) => ({
        id: entity.id,
        slug: entity.slug,
        title: entity.title,
        eventMediaUrl: entity.eventMediaUrl,
        eventDate: entity.eventDate,
        eventLocation: entity.eventLocation,
        eventTime: entity.eventTime,
        status: entity.status,
      }),
    );

    return buildPaginatedResult(data, total, page, limit);
  }

  async findPublishedBySlug(slug: string): Promise<InteractiveProgramme> {
    const entity = await this.repo.findOne({
      where: { slug, status: ContentStatus.PUBLISHED },
    });
    if (!entity) {
      throw new NotFoundException(
        `Published interactive programme not found for slug "${slug}".`,
      );
    }
    return entity;
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResult<InteractiveProgramme>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const qb = this.repo
      .createQueryBuilder('entity')
      .orderBy('entity.eventDate', 'DESC', 'NULLS LAST')
      .addOrderBy('entity.createdAt', 'DESC');

    applyDeletedFilter(qb, query);

    if (query.status) {
      qb.andWhere('entity.status = :status', { status: query.status });
    }

    if (query.search) {
      qb.andWhere(
        '(entity.title ILIKE :search OR entity.slug ILIKE :search OR entity.eventLocation ILIKE :search)',
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
  ): Promise<PaginatedResult<InteractiveProgramme>> {
    return this.findAll({ ...query, includeDeleted: true, onlyDeleted: true });
  }

  async findOne(id: string): Promise<InteractiveProgramme> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(
        `Interactive programme not found for id "${id}".`,
      );
    }
    return entity;
  }

  async update(
    id: string,
    dto: UpdateInteractiveProgrammeDto,
    files?: InteractiveProgrammeFiles,
  ): Promise<InteractiveProgramme> {
    const entity = await this.findOne(id);

    if (dto.slug && dto.slug !== entity.slug) {
      await this.assertSlugAvailable(dto.slug, id);
    }

    if (dto.title !== undefined) entity.title = dto.title;
    if (dto.slug !== undefined) entity.slug = dto.slug;
    if (dto.eventDate !== undefined) entity.eventDate = dto.eventDate || null;
    if (dto.eventLocation !== undefined) {
      entity.eventLocation = dto.eventLocation || null;
    }
    if (dto.eventTime !== undefined) entity.eventTime = dto.eventTime || null;
    if (dto.content !== undefined) entity.content = dto.content || null;
    if (dto.status !== undefined) entity.status = dto.status;

    const mediaFile = files?.eventMedia?.[0];
    if (mediaFile) {
      entity.eventMediaUrl =
        (await this.cdn.replace(
          entity.eventMediaUrl,
          mediaFile,
          CDN_FOLDER,
          mediaKind(mediaFile),
        )) ?? entity.eventMediaUrl;
    } else if (dto.eventMediaUrl !== undefined) {
      if (!dto.eventMediaUrl && entity.eventMediaUrl) {
        await this.cdn.delete(entity.eventMediaUrl);
      }
      entity.eventMediaUrl = dto.eventMediaUrl || null;
    }

    const saved = await this.repo.save(entity);
    this.chatbotSync.notify('interactive_programmes', saved.id);
    this.chatbotSync.notify('interactive_programmes_index', 'all');
    return saved;
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.softRemove(entity);
    this.logger.log(`Soft-deleted interactive programme ${id}`);
    this.chatbotSync.notify('interactive_programmes', id, 'delete');
    this.chatbotSync.notify('interactive_programmes_index', 'all');
  }

  async restore(id: string): Promise<InteractiveProgramme> {
    const restored = await restoreSoftDeleted(
      this.repo,
      id,
      'InteractiveProgramme',
    );
    this.chatbotSync.notify('interactive_programmes', restored.id);
    this.chatbotSync.notify('interactive_programmes_index', 'all');
    return restored;
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
