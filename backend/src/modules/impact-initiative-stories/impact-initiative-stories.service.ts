import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  buildPaginatedResult,
  PaginatedResult,
} from '../../common/interfaces/paginated.interface';
import { CdnFile, CdnService } from '../../common/storage/cdn.service';
import {
  applyDeletedFilter,
  restoreSoftDeleted,
} from '../../common/utils/soft-delete';
import { ImpactInitiative } from '../impact-initiatives/entities/impact-initiative.entity';
import { CreateImpactInitiativeStoryDto } from './dto/create-impact-initiative-story.dto';
import { ImpactInitiativeStoryQueryDto } from './dto/impact-initiative-story-query.dto';
import { UpdateImpactInitiativeStoryDto } from './dto/update-impact-initiative-story.dto';
import { ImpactInitiativeStory } from './entities/impact-initiative-story.entity';

const CDN_FOLDER = 'impact-initiative-stories';

@Injectable()
export class ImpactInitiativeStoriesService {
  private readonly logger = new Logger(ImpactInitiativeStoriesService.name);

  constructor(
    @InjectRepository(ImpactInitiativeStory)
    private readonly repo: Repository<ImpactInitiativeStory>,
    @InjectRepository(ImpactInitiative)
    private readonly initiativeRepo: Repository<ImpactInitiative>,
    private readonly cdn: CdnService,
  ) {}

  async create(
    dto: CreateImpactInitiativeStoryDto,
    file?: CdnFile,
  ): Promise<ImpactInitiativeStory> {
    await this.assertInitiativeExists(dto.initiativeId);

    let imageUrl = dto.imageUrl;
    if (file) {
      imageUrl = await this.cdn.upload(file, CDN_FOLDER, 'image');
    }

    try {
      const entity = this.repo.create({
        ...dto,
        title: dto.title.trim(),
        imageUrl,
        displayOrder: dto.displayOrder ?? 1,
      });

      const saved = await this.repo.save(entity);
      this.logger.log(`Created impact initiative story "${saved.title}" with ID ${saved.id}`);
      return saved;
    } catch (err) {
      if (file && imageUrl) {
        await this.cdn.delete(imageUrl);
      }
      throw err;
    }
  }

  /**
   * Public endpoint helper: Get all stories for a specific initiative
   */
  async findByInitiative(initiativeId: string): Promise<ImpactInitiativeStory[]> {
    await this.assertInitiativeExists(initiativeId);

    return this.repo.find({
      where: { initiativeId },
      order: {
        displayOrder: 'ASC',
        createdAt: 'DESC',
      },
    });
  }

  async findAll(
    query: ImpactInitiativeStoryQueryDto,
  ): Promise<PaginatedResult<ImpactInitiativeStory>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const qb = this.repo
      .createQueryBuilder('entity')
      .leftJoinAndSelect('entity.initiative', 'initiative')
      .orderBy('entity.displayOrder', 'ASC')
      .addOrderBy('entity.createdAt', 'DESC');

    applyDeletedFilter(qb, query);

    if (query.initiativeId) {
      qb.andWhere('entity.initiativeId = :initiativeId', {
        initiativeId: query.initiativeId,
      });
    }

    if (query.search) {
      qb.andWhere(
        '(entity.title ILIKE :search OR entity.content ILIKE :search)',
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
    query: ImpactInitiativeStoryQueryDto,
  ): Promise<PaginatedResult<ImpactInitiativeStory>> {
    return this.findAll({ ...query, includeDeleted: true, onlyDeleted: true });
  }

  async findOne(id: string): Promise<ImpactInitiativeStory> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ['initiative'],
    });

    if (!entity) {
      throw new NotFoundException(
        `Impact initiative story not found for id "${id}". Check the id and try again.`,
      );
    }

    return entity;
  }

  async update(
    id: string,
    dto: UpdateImpactInitiativeStoryDto,
    file?: CdnFile,
  ): Promise<ImpactInitiativeStory> {
    const entity = await this.findOne(id);

    if (dto.initiativeId && dto.initiativeId !== entity.initiativeId) {
      await this.assertInitiativeExists(dto.initiativeId);
    }

    Object.assign(entity, {
      ...dto,
      title: dto.title ? dto.title.trim() : entity.title,
    });

    if (file) {
      entity.imageUrl =
        (await this.cdn.replace(entity.imageUrl, file, CDN_FOLDER, 'image')) ??
        entity.imageUrl;
      this.logger.log(
        `Replaced CDN image for impact initiative story ID ${id}: new URL is ${entity.imageUrl}`,
      );
    }

    const saved = await this.repo.save(entity);
    this.logger.log(`Updated impact initiative story with ID ${id}`);
    return saved;
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.softRemove(entity);
    this.logger.log(`Soft-deleted impact initiative story with ID ${id}`);
  }

  async restore(id: string): Promise<ImpactInitiativeStory> {
    return restoreSoftDeleted(this.repo, id, 'Impact initiative story');
  }

  private async assertInitiativeExists(initiativeId: string): Promise<void> {
    const initiative = await this.initiativeRepo.findOne({
      where: { id: initiativeId },
    });

    if (!initiative) {
      throw new NotFoundException(
        `Impact initiative not found for id "${initiativeId}".`,
      );
    }
  }
}

