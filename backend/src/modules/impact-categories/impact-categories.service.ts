import {
  ConflictException,
  Injectable,
  Logger,
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
import { CreateImpactCategoryDto } from './dto/create-impact-category.dto';
import { ImpactCategoryQueryDto } from './dto/impact-category-query.dto';
import { UpdateImpactCategoryDto } from './dto/update-impact-category.dto';
import { ImpactCategory } from './entities/impact-category.entity';

@Injectable()
export class ImpactCategoriesService {
  private readonly logger = new Logger(ImpactCategoriesService.name);

  constructor(
    @InjectRepository(ImpactCategory)
    private readonly repo: Repository<ImpactCategory>,
  ) {}

  async create(dto: CreateImpactCategoryDto): Promise<ImpactCategory> {
    const slug = dto.slug.trim().toLowerCase();
    const name = dto.name.trim();

    await this.assertUniqueNameAndSlug(name, slug);

    const entity = this.repo.create({
      ...dto,
      name,
      slug,
      displayOrder: dto.displayOrder ?? 1,
      status: dto.status ?? ContentStatus.PUBLISHED,
    });

    try {
      const saved = await this.repo.save(entity);
      this.logger.log(
        `Created impact category "${saved.name}" with ID ${saved.id}`,
      );
      return saved;
    } catch (err) {
      if (this.isUniqueViolation(err)) {
        throw new ConflictException(
          'An impact category with this name or slug already exists.',
        );
      }
      throw err;
    }
  }

  /**
   * Public endpoint helper: Get all active/published categories for website navigation
   */
  async findPublished(): Promise<ImpactCategory[]> {
    return this.repo.find({
      where: { status: ContentStatus.PUBLISHED },
      order: {
        displayOrder: 'ASC',
        name: 'ASC',
      },
    });
  }

  /**
   * Public endpoint helper: Find published category by slug
   */
  async findBySlug(slug: string): Promise<ImpactCategory> {
    const entity = await this.repo.findOne({
      where: {
        slug: slug.trim().toLowerCase(),
        status: ContentStatus.PUBLISHED,
      },
    });

    if (!entity) {
      throw new NotFoundException(
        `Impact category not found for slug "${slug}".`,
      );
    }

    return entity;
  }

  async findAll(
    query: ImpactCategoryQueryDto,
  ): Promise<PaginatedResult<ImpactCategory>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const qb = this.repo
      .createQueryBuilder('entity')
      .orderBy('entity.displayOrder', 'ASC')
      .addOrderBy('entity.name', 'ASC');

    applyDeletedFilter(qb, query);

    if (query.status) {
      qb.andWhere('entity.status = :status', { status: query.status });
    }

    if (query.search) {
      qb.andWhere('(entity.name ILIKE :search OR entity.slug ILIKE :search)', {
        search: `%${query.search}%`,
      });
    }

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return buildPaginatedResult(data, total, page, limit);
  }

  async findDeleted(
    query: ImpactCategoryQueryDto,
  ): Promise<PaginatedResult<ImpactCategory>> {
    return this.findAll({ ...query, includeDeleted: true, onlyDeleted: true });
  }

  async findOne(id: string): Promise<ImpactCategory> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(
        `Impact category not found for id "${id}". Check the id and try again.`,
      );
    }
    return entity;
  }

  async update(
    id: string,
    dto: UpdateImpactCategoryDto,
  ): Promise<ImpactCategory> {
    const entity = await this.findOne(id);

    const newSlug = dto.slug ? dto.slug.trim().toLowerCase() : entity.slug;
    const newName = dto.name ? dto.name.trim() : entity.name;

    await this.assertUniqueNameAndSlug(newName, newSlug, id);

    Object.assign(entity, {
      ...dto,
      name: newName,
      slug: newSlug,
    });

    try {
      const saved = await this.repo.save(entity);
      this.logger.log(`Updated impact category with ID ${id}`);
      return saved;
    } catch (err) {
      if (this.isUniqueViolation(err)) {
        throw new ConflictException(
          'An impact category with this name or slug already exists.',
        );
      }
      throw err;
    }
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.softRemove(entity);
    this.logger.log(`Soft-deleted impact category with ID ${id}`);
  }

  async restore(id: string): Promise<ImpactCategory> {
    return restoreSoftDeleted(this.repo, id, 'Impact category');
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
          `An impact category with slug "${slug}" already exists. Please choose a different slug.`,
        );
      }
      throw new ConflictException(
        `An impact category named "${name}" already exists. Please choose a different name.`,
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
