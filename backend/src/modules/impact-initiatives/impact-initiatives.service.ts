import {
  BadRequestException,
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
import { ImpactCategory } from '../impact-categories/entities/impact-category.entity';
import { CreateImpactInitiativeDto } from './dto/create-impact-initiative.dto';
import { ImpactInitiativeQueryDto } from './dto/impact-initiative-query.dto';
import { UpdateImpactInitiativeDto } from './dto/update-impact-initiative.dto';
import { ImpactInitiative } from './entities/impact-initiative.entity';

@Injectable()
export class ImpactInitiativesService {
  private readonly logger = new Logger(ImpactInitiativesService.name);

  constructor(
    @InjectRepository(ImpactInitiative)
    private readonly repo: Repository<ImpactInitiative>,
    @InjectRepository(ImpactCategory)
    private readonly categoryRepo: Repository<ImpactCategory>,
  ) {}

  async create(dto: CreateImpactInitiativeDto): Promise<ImpactInitiative> {
    await this.assertCategoryValidForInitiative(dto.categoryId);

    const slug = dto.slug.trim().toLowerCase();
    const name = dto.name.trim();

    await this.assertUniqueNameAndSlug(name, slug, dto.categoryId);

    const entity = this.repo.create({
      ...dto,
      name,
      slug,
      displayOrder: dto.displayOrder ?? 1,
      status: dto.status ?? ContentStatus.PUBLISHED,
    });

    try {
      const saved = await this.repo.save(entity);
      this.logger.log(`Created impact initiative "${saved.name}" with ID ${saved.id}`);
      return saved;
    } catch (err) {
      if (this.isUniqueViolation(err)) {
        throw new ConflictException(
          'An impact initiative with this name or slug already exists.',
        );
      }
      throw err;
    }
  }

  /**
   * Public endpoint helper: Get all active/published initiatives whose category is also published
   */
  async findPublished(categoryId?: string): Promise<ImpactInitiative[]> {
    const qb = this.repo
      .createQueryBuilder('entity')
      .innerJoinAndSelect(
        'entity.category',
        'category',
        'category.status = :catStatus',
        { catStatus: ContentStatus.PUBLISHED },
      )
      .where('entity.status = :status', { status: ContentStatus.PUBLISHED })
      .orderBy('entity.displayOrder', 'ASC')
      .addOrderBy('entity.name', 'ASC');

    if (categoryId) {
      qb.andWhere('entity.categoryId = :categoryId', { categoryId });
    }

    return qb.getMany();
  }

  /**
   * Public endpoint helper: Find published initiative by unique slug (category must also be published)
   */
  async findBySlug(slug: string): Promise<ImpactInitiative> {
    const entity = await this.repo
      .createQueryBuilder('entity')
      .innerJoinAndSelect(
        'entity.category',
        'category',
        'category.status = :catStatus',
        { catStatus: ContentStatus.PUBLISHED },
      )
      .leftJoinAndSelect('entity.stories', 'stories')
      .where('entity.slug = :slug', { slug: slug.trim().toLowerCase() })
      .andWhere('entity.status = :status', { status: ContentStatus.PUBLISHED })
      .orderBy('stories.displayOrder', 'ASC')
      .addOrderBy('stories.createdAt', 'DESC')
      .getOne();

    if (!entity) {
      throw new NotFoundException(
        `Impact initiative not found for slug "${slug}".`,
      );
    }

    return entity;
  }

  /**
   * Public endpoint helper: Find published initiatives for a given category slug
   */
  async findByCategorySlug(categorySlug: string): Promise<ImpactInitiative[]> {
    const category = await this.categoryRepo.findOne({
      where: {
        slug: categorySlug.trim().toLowerCase(),
        status: ContentStatus.PUBLISHED,
      },
    });

    if (!category) {
      throw new NotFoundException(
        `Impact category not found or is not published for slug "${categorySlug}".`,
      );
    }

    return this.findPublished(category.id);
  }

  async findAll(
    query: ImpactInitiativeQueryDto,
  ): Promise<PaginatedResult<ImpactInitiative>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const qb = this.repo
      .createQueryBuilder('entity')
      .leftJoinAndSelect('entity.category', 'category')
      .orderBy('entity.displayOrder', 'ASC')
      .addOrderBy('entity.createdAt', 'DESC');

    applyDeletedFilter(qb, query);

    if (query.status) {
      qb.andWhere('entity.status = :status', { status: query.status });
    }

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

  async findDeleted(
    query: ImpactInitiativeQueryDto,
  ): Promise<PaginatedResult<ImpactInitiative>> {
    return this.findAll({ ...query, includeDeleted: true, onlyDeleted: true });
  }

  async findOne(id: string): Promise<ImpactInitiative> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!entity) {
      throw new NotFoundException(
        `Impact initiative not found for id "${id}". Check the id and try again.`,
      );
    }

    return entity;
  }

  async update(
    id: string,
    dto: UpdateImpactInitiativeDto,
  ): Promise<ImpactInitiative> {
    const entity = await this.findOne(id);

    const targetCategoryId = dto.categoryId ?? entity.categoryId;

    if (dto.categoryId && dto.categoryId !== entity.categoryId) {
      await this.assertCategoryValidForInitiative(dto.categoryId);
    } else if (dto.status === ContentStatus.PUBLISHED) {
      await this.assertCategoryValidForInitiative(targetCategoryId);
    }

    const newSlug = dto.slug ? dto.slug.trim().toLowerCase() : entity.slug;
    const newName = dto.name ? dto.name.trim() : entity.name;

    await this.assertUniqueNameAndSlug(newName, newSlug, targetCategoryId, id);

    Object.assign(entity, {
      ...dto,
      name: newName,
      slug: newSlug,
    });

    try {
      const saved = await this.repo.save(entity);
      this.logger.log(`Updated impact initiative with ID ${id}`);
      return saved;
    } catch (err) {
      if (this.isUniqueViolation(err)) {
        throw new ConflictException(
          'An impact initiative with this name or slug already exists.',
        );
      }
      throw err;
    }
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.softRemove(entity);
    this.logger.log(`Soft-deleted impact initiative with ID ${id}`);
  }

  async restore(id: string): Promise<ImpactInitiative> {
    return restoreSoftDeleted(this.repo, id, 'Impact initiative');
  }

  private async assertCategoryValidForInitiative(
    categoryId: string,
  ): Promise<ImpactCategory> {
    const category = await this.categoryRepo.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(
        `Impact category not found for id "${categoryId}".`,
      );
    }

    if (category.status !== ContentStatus.PUBLISHED) {
      throw new BadRequestException(
        `Cannot assign initiative to category "${category.name}" because the category is in "${category.status}" status. Only published categories can have initiatives.`,
      );
    }

    return category;
  }

  private async assertUniqueNameAndSlug(
    name: string,
    slug: string,
    categoryId: string,
    currentId?: string,
  ): Promise<void> {
    // Check global slug uniqueness
    const slugQb = this.repo
      .createQueryBuilder('initiative')
      .where('initiative.slug = :slug', { slug });

    if (currentId) {
      slugQb.andWhere('initiative.id != :id', { id: currentId });
    }

    const existingSlug = await slugQb.getOne();
    if (existingSlug) {
      throw new ConflictException(
        `An initiative with slug "${slug}" already exists. Please choose a different slug.`,
      );
    }

    // Check name uniqueness within the category
    const nameQb = this.repo
      .createQueryBuilder('initiative')
      .where('initiative.categoryId = :categoryId', { categoryId })
      .andWhere('LOWER(TRIM(initiative.name)) = LOWER(TRIM(:name))', { name });

    if (currentId) {
      nameQb.andWhere('initiative.id != :id', { id: currentId });
    }

    const existingName = await nameQb.getOne();
    if (existingName) {
      throw new ConflictException(
        `An initiative named "${name}" already exists in this category. Please choose a different name.`,
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
