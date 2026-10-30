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
import { CreateHomeBannerDto } from './dto/create-home-banner.dto';
import { UpdateHomeBannerDto } from './dto/update-home-banner.dto';
import { HomeBanner } from './entities/home-banner.entity';

const CDN_FOLDER = 'home-banners';

export interface HomeBannerFiles {
  bannerImage?: CdnFile[];
  mobileBannerImage?: CdnFile[];
}

@Injectable()
export class HomeBannersService {
  private readonly logger = new Logger(HomeBannersService.name);

  constructor(
    @InjectRepository(HomeBanner)
    private readonly repo: Repository<HomeBanner>,
    private readonly cdn: CdnService,
  ) {}

  async create(
    dto: CreateHomeBannerDto,
    files?: HomeBannerFiles,
  ): Promise<HomeBanner> {
    const bannerImageFile = files?.bannerImage?.[0];
    const mobileBannerImageFile = files?.mobileBannerImage?.[0];

    if (!bannerImageFile) {
      throw new BadRequestException('Desktop banner image file is required.');
    }

    const bannerImageUrl = await this.cdn.upload(
      bannerImageFile,
      CDN_FOLDER,
      'image',
    );

    let mobileBannerImageUrl: string | null = null;
    if (mobileBannerImageFile) {
      mobileBannerImageUrl = await this.cdn.upload(
        mobileBannerImageFile,
        CDN_FOLDER,
        'image',
      );
    }

    try {
      const entity = this.repo.create({
        ...dto,
        bannerImageUrl,
        mobileBannerImageUrl,
        displayOrder: dto.displayOrder ?? 1,
        status: dto.status ?? ContentStatus.DRAFT,
      });

      const saved = await this.repo.save(entity);
      this.logger.log(`Created home banner with ID ${saved.id}`);
      return saved;
    } catch (err) {
      if (bannerImageUrl) {
        await this.cdn.delete(bannerImageUrl);
      }
      if (mobileBannerImageUrl) {
        await this.cdn.delete(mobileBannerImageUrl);
      }
      throw err;
    }
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResult<HomeBanner>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const qb = this.repo
      .createQueryBuilder('entity')
      .orderBy('entity.displayOrder', 'ASC')
      .addOrderBy('entity.createdAt', 'DESC');

    applyDeletedFilter(qb, query);

    if (query.status) {
      qb.andWhere('entity.status = :status', { status: query.status });
    }

    if (query.search) {
      qb.andWhere(
        '(entity.title ILIKE :search OR entity.location ILIKE :search OR entity.shortDescription ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return buildPaginatedResult(data, total, page, limit);
  }

  async findPublished(): Promise<HomeBanner[]> {
    return this.repo.find({
      where: { status: ContentStatus.PUBLISHED },
      order: { displayOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  async findDeleted(
    query: PaginationQueryDto,
  ): Promise<PaginatedResult<HomeBanner>> {
    return this.findAll({ ...query, includeDeleted: true, onlyDeleted: true });
  }

  async findOne(id: string): Promise<HomeBanner> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(
        `Home banner not found for id "${id}". Check the id and try again.`,
      );
    }
    return entity;
  }

  async update(
    id: string,
    dto: UpdateHomeBannerDto,
    files?: HomeBannerFiles,
  ): Promise<HomeBanner> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);

    const bannerImageFile = files?.bannerImage?.[0];
    const mobileBannerImageFile = files?.mobileBannerImage?.[0];

    if (bannerImageFile) {
      entity.bannerImageUrl =
        (await this.cdn.replace(
          entity.bannerImageUrl,
          bannerImageFile,
          CDN_FOLDER,
          'image',
        )) ?? entity.bannerImageUrl;
      this.logger.log(`Replaced CDN banner image for home banner ID ${id}`);
    }

    if (mobileBannerImageFile) {
      entity.mobileBannerImageUrl =
        (await this.cdn.replace(
          entity.mobileBannerImageUrl,
          mobileBannerImageFile,
          CDN_FOLDER,
          'image',
        )) ?? entity.mobileBannerImageUrl;
      this.logger.log(
        `Replaced CDN mobile banner image for home banner ID ${id}`,
      );
    }

    return await this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.softRemove(entity);
    this.logger.log(`Soft-deleted home banner with ID ${id}`);
  }

  async restore(id: string): Promise<HomeBanner> {
    return restoreSoftDeleted(this.repo, id, 'Home banner');
  }
}
