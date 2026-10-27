import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import {
  buildPaginatedResult,
  PaginatedResult,
} from '../../common/interfaces/paginated.interface';
import {
  applyDeletedFilter,
  restoreSoftDeleted,
} from '../../common/utils/soft-delete';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
import { BlogCategory } from './entities/blog-category.entity';

@Injectable()
export class BlogCategoriesService {
  constructor(
    @InjectRepository(BlogCategory)
    private readonly repo: Repository<BlogCategory>,
  ) {}

  async create(dto: CreateBlogCategoryDto): Promise<BlogCategory> {
    const slug = dto.slug.trim();
    await this.assertUniqueNameAndSlug(dto.name, slug);

    const entity = this.repo.create({
      ...dto,
      slug,
    });
    return await this.repo.save(entity);
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResult<BlogCategory>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const qb = this.repo
      .createQueryBuilder('entity')
      .orderBy('entity.createdAt', 'DESC');
    applyDeletedFilter(qb, query);

    if (query.search) {
      qb.andWhere(
        '(entity.name ILIKE :search OR entity.slug ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return buildPaginatedResult(data, total, page, limit);
  }

  async findPublished(): Promise<BlogCategory[]> {
    return this.repo.find({
      order: { name: 'ASC' },
    });
  }

  async findDeleted(
    query: PaginationQueryDto,
  ): Promise<PaginatedResult<BlogCategory>> {
    return this.findAll({ ...query, includeDeleted: true, onlyDeleted: true });
  }

  async findOne(id: string): Promise<BlogCategory> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(
        `Blog category not found for id "${id}". Check the id and try again.`,
      );
    }
    return entity;
  }

  async findBySlug(slug: string): Promise<BlogCategory> {
    const entity = await this.repo.findOne({ where: { slug } });
    if (!entity) {
      throw new NotFoundException(
        `Blog category not found for slug "${slug}".`,
      );
    }
    return entity;
  }

  async update(
    id: string,
    dto: UpdateBlogCategoryDto,
  ): Promise<BlogCategory> {
    const entity = await this.findOne(id);
    const newSlug = dto.slug ? dto.slug.trim() : entity.slug;
    const newName = dto.name ?? entity.name;

    await this.assertUniqueNameAndSlug(newName, newSlug, id);

    Object.assign(entity, {
      ...dto,
      slug: newSlug,
    });

    try {
      return await this.repo.save(entity);
    } catch (err) {
      if (this.isUniqueViolation(err)) {
        throw new ConflictException(
          'A blog category with this name or slug already exists. Choose a different one.',
        );
      }
      throw err;
    }
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.softRemove(entity);
  }

  async restore(id: string): Promise<BlogCategory> {
    return restoreSoftDeleted(this.repo, id, 'Blog category');
  }

  private async assertUniqueNameAndSlug(
    name: string,
    slug: string,
    currentId?: string,
  ): Promise<void> {
    const qb = this.repo
      .createQueryBuilder('category')
      .where(
        '(LOWER(TRIM(category.name)) = LOWER(TRIM(:name)) OR category.slug = :slug)',
        { name, slug },
      );

    if (currentId) {
      qb.andWhere('category.id != :id', { id: currentId });
    }

    const existing = await qb.getOne();
    if (existing) {
      if (existing.slug === slug) {
        throw new ConflictException(
          `A category with slug "${slug}" already exists. Please choose a different slug.`,
        );
      }
      throw new ConflictException(
        `A category named "${name}" already exists. Please choose a different name.`,
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
