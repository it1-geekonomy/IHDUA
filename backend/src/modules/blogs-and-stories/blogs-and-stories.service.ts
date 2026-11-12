import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { ContentStatus } from '../../common/enums/content-status.enum';
import {
  buildPaginatedResult,
  PaginatedResult,
} from '../../common/interfaces/paginated.interface';
import {
  applyDeletedFilter,
  restoreSoftDeleted,
} from '../../common/utils/soft-delete';
import { CdnFile, CdnService } from '../../common/storage/cdn.service';
import { ChatbotSyncService } from '../../common/chatbot-sync/chatbot-sync.service';
import { BlogCategory } from '../blog-categories/entities/blog-category.entity';
import { CreateBlogAndStoryDto } from './dto/create-blog-and-story.dto';
import { QueryBlogAndStoryDto } from './dto/query-blog-and-story.dto';
import { UpdateBlogAndStoryDto } from './dto/update-blog-and-story.dto';
import { BlogAndStory } from './entities/blog-and-story.entity';

const CDN_FOLDER = 'blogs';

export interface BlogAndStoryFiles {
  blogBanner?: CdnFile[];
  video?: CdnFile[];
}

@Injectable()
export class BlogsAndStoriesService {
  constructor(
    @InjectRepository(BlogAndStory)
    private readonly repo: Repository<BlogAndStory>,
    @InjectRepository(BlogCategory)
    private readonly categoryRepo: Repository<BlogCategory>,
    private readonly cdn: CdnService,
    private readonly chatbotSync: ChatbotSyncService,
  ) {}

  async create(
    dto: CreateBlogAndStoryDto,
    files?: BlogAndStoryFiles | CdnFile,
  ): Promise<BlogAndStory> {
    const slug = dto.slug.trim();
    await this.assertUniqueTitleAndSlug(dto.title, slug);

    if (dto.categoryId) {
      await this.assertCategoryExists(dto.categoryId);
    }

    const bannerFile = Array.isArray((files as BlogAndStoryFiles)?.blogBanner)
      ? (files as BlogAndStoryFiles)?.blogBanner?.[0]
      : (files as CdnFile)?.buffer
        ? (files as CdnFile)
        : undefined;

    const videoFile = (files as BlogAndStoryFiles)?.video?.[0];

    let blogBanner = dto.blogBanner;
    if (bannerFile) {
      blogBanner = await this.cdn.upload(bannerFile, CDN_FOLDER, 'image');
    }

    let video = dto.video;
    if (videoFile) {
      video = await this.cdn.upload(videoFile, CDN_FOLDER, 'video');
    }

    const entity = this.repo.create({
      ...dto,
      blogBanner,
      video,
      slug,
      status: dto.status ?? ContentStatus.DRAFT,
    });

    try {
      const saved = await this.repo.save(entity);
      if (saved.status === ContentStatus.PUBLISHED) {
        this.chatbotSync.syncContent({
          table: 'blogs',
          source_id: saved.id,
          action: 'upsert',
          title: saved.title,
          content: `${saved.title}\n\n${saved.content || ''}`,
          url: `/blogs/${saved.slug}`,
          category: 'Blog',
          slug: saved.slug,
        });
      }
      return saved;
    } catch (err) {
      if (bannerFile && blogBanner) {
        await this.cdn.delete(blogBanner);
      }
      if (videoFile && video) {
        await this.cdn.delete(video);
      }
      if (this.isUniqueViolation(err)) {
        throw new ConflictException(
          'A blog with this title or slug already exists. Choose a different one.',
        );
      }
      throw err;
    }
  }

  async findAll(
    query: QueryBlogAndStoryDto,
  ): Promise<PaginatedResult<BlogAndStory>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const isOldest = query.sort?.toLowerCase() === 'oldest';
    const direction = isOldest ? 'ASC' : 'DESC';

    const qb = this.repo
      .createQueryBuilder('entity')
      .leftJoinAndSelect('entity.category', 'category')
      .orderBy('entity.blogDate', direction, 'NULLS LAST')
      .addOrderBy('entity.createdAt', direction);

    applyDeletedFilter(qb, query);

    if (query.status) {
      qb.andWhere('entity.status = :status', { status: query.status });
    }

    if (query.categoryId) {
      qb.andWhere('entity.categoryId = :categoryId', {
        categoryId: query.categoryId,
      });
    }

    if (query.search) {
      qb.andWhere(
        '(entity.title ILIKE :search OR entity.slug ILIKE :search OR entity.shortDescription ILIKE :search OR entity.content ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return buildPaginatedResult(data, total, page, limit);
  }

  async findPublished(
    query: QueryBlogAndStoryDto,
  ): Promise<PaginatedResult<BlogAndStory>> {
    return this.findAll({
      ...query,
      status: ContentStatus.PUBLISHED,
      includeDeleted: false,
    });
  }

  async findDeleted(
    query: QueryBlogAndStoryDto,
  ): Promise<PaginatedResult<BlogAndStory>> {
    return this.findAll({
      ...query,
      includeDeleted: true,
      onlyDeleted: true,
    });
  }

  async findOne(id: string): Promise<BlogAndStory> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!entity) {
      throw new NotFoundException(
        `Blog or story not found for id "${id}". Check the id and try again.`,
      );
    }
    return entity;
  }

  async findBySlug(slug: string): Promise<BlogAndStory> {
    const entity = await this.repo.findOne({
      where: { slug, status: ContentStatus.PUBLISHED },
      relations: ['category'],
    });
    if (!entity) {
      throw new NotFoundException(
        `Published blog or story not found for slug "${slug}".`,
      );
    }
    return entity;
  }

  async findPublishedBySlugWithRelated(
    slug: string,
    limit = 3,
    page = 1,
  ): Promise<BlogAndStory & { relatedStories: BlogAndStory[] }> {
    const entity = await this.findBySlug(slug);
    const take = Number(limit) || 3;
    const skip = ((Number(page) || 1) - 1) * take;

    let relatedStories: BlogAndStory[] = [];
    if (entity.categoryId) {
      relatedStories = await this.repo
        .createQueryBuilder('blog')
        .leftJoinAndSelect('blog.category', 'category')
        .where('blog.categoryId = :categoryId', {
          categoryId: entity.categoryId,
        })
        .andWhere('blog.id != :id', { id: entity.id })
        .andWhere('blog.status = :status', { status: ContentStatus.PUBLISHED })
        .andWhere('blog.deletedAt IS NULL')
        .orderBy('blog.blogDate', 'DESC', 'NULLS LAST')
        .addOrderBy('blog.createdAt', 'DESC')
        .skip(skip)
        .take(take)
        .getMany();
    }

    return {
      ...entity,
      relatedStories,
    };
  }

  async findByIdWithRelated(
    id: string,
    limit = 3,
    page = 1,
  ): Promise<BlogAndStory & { relatedStories: BlogAndStory[] }> {
    const entity = await this.findOne(id);
    const take = Number(limit) || 3;
    const skip = ((Number(page) || 1) - 1) * take;

    let relatedStories: BlogAndStory[] = [];
    if (entity.categoryId) {
      relatedStories = await this.repo
        .createQueryBuilder('blog')
        .leftJoinAndSelect('blog.category', 'category')
        .where('blog.categoryId = :categoryId', {
          categoryId: entity.categoryId,
        })
        .andWhere('blog.id != :id', { id: entity.id })
        .andWhere('blog.status = :status', { status: ContentStatus.PUBLISHED })
        .andWhere('blog.deletedAt IS NULL')
        .orderBy('blog.blogDate', 'DESC', 'NULLS LAST')
        .addOrderBy('blog.createdAt', 'DESC')
        .skip(skip)
        .take(take)
        .getMany();
    }

    return {
      ...entity,
      relatedStories,
    };
  }

  async findRelated(
    id: string,
    limit = 3,
    page = 1,
  ): Promise<BlogAndStory & { relatedStories: BlogAndStory[] }> {
    return this.findByIdWithRelated(id, limit, page);
  }

  async update(
    id: string,
    dto: UpdateBlogAndStoryDto,
    files?: BlogAndStoryFiles | CdnFile,
  ): Promise<BlogAndStory> {
    const entity = await this.findOne(id);
    const newSlug = dto.slug ? dto.slug.trim() : entity.slug;
    const newTitle = dto.title ?? entity.title;

    await this.assertUniqueTitleAndSlug(newTitle, newSlug, id);

    if (dto.categoryId !== undefined) {
      if (dto.categoryId) {
        await this.assertCategoryExists(dto.categoryId);
      }
    }

    const bannerFile = Array.isArray((files as BlogAndStoryFiles)?.blogBanner)
      ? (files as BlogAndStoryFiles)?.blogBanner?.[0]
      : (files as CdnFile)?.buffer
        ? (files as CdnFile)
        : undefined;

    const videoFile = (files as BlogAndStoryFiles)?.video?.[0];

    if (bannerFile) {
      entity.blogBanner =
        (await this.cdn.replace(
          entity.blogBanner,
          bannerFile,
          CDN_FOLDER,
          'image',
        )) ?? entity.blogBanner;
    } else if (dto.blogBanner !== undefined) {
      if (!dto.blogBanner && entity.blogBanner) {
        await this.cdn.delete(entity.blogBanner);
      }
      entity.blogBanner = dto.blogBanner || null;
    }

    if (videoFile) {
      entity.video =
        (await this.cdn.replace(
          entity.video,
          videoFile,
          CDN_FOLDER,
          'video',
        )) ?? entity.video;
    } else if (dto.video !== undefined) {
      if (!dto.video && entity.video) {
        await this.cdn.delete(entity.video);
      }
      entity.video = dto.video || null;
    }

    Object.assign(entity, {
      ...dto,
      slug: newSlug,
      blogBanner: entity.blogBanner,
      video: entity.video,
    });

    try {
      const saved = await this.repo.save(entity);
      if (saved.status === ContentStatus.PUBLISHED) {
        this.chatbotSync.syncContent({
          table: 'blogs',
          source_id: saved.id,
          action: 'upsert',
          title: saved.title,
          content: `${saved.title}\n\n${saved.content || ''}`,
          url: `/blogs/${saved.slug}`,
          category: 'Blog',
          slug: saved.slug,
        });
      } else {
        this.chatbotSync.syncContent({
          table: 'blogs',
          source_id: saved.id,
          action: 'delete',
        });
      }
      return saved;
    } catch (err) {
      if (this.isUniqueViolation(err)) {
        throw new ConflictException(
          'A blog with this title or slug already exists. Choose a different one.',
        );
      }
      throw err;
    }
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.softRemove(entity);
    this.chatbotSync.syncContent({
      table: 'blogs',
      source_id: id,
      action: 'delete',
    });
  }

  async restore(id: string): Promise<BlogAndStory> {
    const restored = await restoreSoftDeleted(this.repo, id, 'Blog/Story');
    if (restored.status === ContentStatus.PUBLISHED) {
      this.chatbotSync.syncContent({
        table: 'blogs',
        source_id: restored.id,
        action: 'upsert',
        title: restored.title,
        content: `${restored.title}\n\n${restored.content || ''}`,
        url: `/blogs/${restored.slug}`,
        category: 'Blog',
        slug: restored.slug,
      });
    }
    return restored;
  }

  private async assertCategoryExists(categoryId: string): Promise<void> {
    const category = await this.categoryRepo.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new BadRequestException(
        `Blog category with id "${categoryId}" does not exist.`,
      );
    }
  }

  private async assertUniqueTitleAndSlug(
    title: string,
    slug: string,
    currentId?: string,
  ): Promise<void> {
    const qb = this.repo
      .createQueryBuilder('blog')
      .where(
        '(LOWER(TRIM(blog.title)) = LOWER(TRIM(:title)) OR blog.slug = :slug)',
        { title, slug },
      );

    if (currentId) {
      qb.andWhere('blog.id != :id', { id: currentId });
    }

    const existing = await qb.getOne();
    if (existing) {
      if (existing.slug === slug) {
        throw new ConflictException(
          `A blog with slug "${slug}" already exists. Please choose a different slug.`,
        );
      }
      throw new ConflictException(
        `A blog titled "${title}" already exists. Please choose a different title.`,
      );
    }
  }

  private isUniqueViolation(err: unknown): boolean {
    return (
      err instanceof QueryFailedError &&
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code?: string }).code === '23505'
    );
  }
}
