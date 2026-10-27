import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';
import { UpdateNewsletterSubscriberDto } from './dto/update-newsletter-subscriber.dto';
import { NewsletterSubscriber } from './entities/newsletter-subscriber.entity';

@Injectable()
export class NewsletterSubscribersService {
  private readonly logger = new Logger(NewsletterSubscribersService.name);

  constructor(
    @InjectRepository(NewsletterSubscriber)
    private readonly repo: Repository<NewsletterSubscriber>,
  ) {}

  /**
   * Subscribe an email from the public website.
   * If the email already exists, it safely re-activates it.
   */
  async subscribe(
    dto: SubscribeNewsletterDto,
  ): Promise<{ subscriber: NewsletterSubscriber; isNew: boolean }> {
    const email = dto.email.trim().toLowerCase();

    const existing = await this.repo.findOne({
      where: { email },
      withDeleted: true,
    });

    if (existing) {
      existing.deletedAt = null;
      existing.isActive = true;
      const saved = await this.repo.save(existing);
      this.logger.log(`Re-activated newsletter subscription for ${email}`);
      return { subscriber: saved, isNew: false };
    }

    const subscriber = this.repo.create({
      email,
      isActive: true,
    });
    const saved = await this.repo.save(subscriber);
    this.logger.log(`Created new newsletter subscription for ${email}`);
    return { subscriber: saved, isNew: true };
  }

  /**
   * CMS list with pagination, search, and deleted filters.
   */
  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResponse<NewsletterSubscriber>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const qb = this.repo
      .createQueryBuilder('entity')
      .orderBy('entity.createdAt', 'DESC');

    applyDeletedFilter(qb, query);

    if (query.search) {
      qb.andWhere('entity.email ILIKE :search', {
        search: `%${query.search}%`,
      });
    }

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return buildPaginatedResult(data, total, page, limit);
  }

  async findOne(id: string): Promise<NewsletterSubscriber> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(
        `Newsletter subscriber not found for id "${id}". Check the id and try again.`,
      );
    }
    return entity;
  }

  async update(
    id: string,
    dto: UpdateNewsletterSubscriberDto,
  ): Promise<NewsletterSubscriber> {
    const entity = await this.findOne(id);

    if (dto.email && dto.email !== entity.email) {
      const emailExists = await this.repo.findOne({
        where: { email: dto.email },
      });
      if (emailExists && emailExists.id !== id) {
        throw new ConflictException(
          `A subscriber with email "${dto.email}" already exists.`,
        );
      }
    }

    Object.assign(entity, dto);
    return await this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.softRemove(entity);
    this.logger.log(`Soft-deleted newsletter subscriber with ID ${id}`);
  }

  async restore(id: string): Promise<NewsletterSubscriber> {
    return restoreSoftDeleted(this.repo, id, 'Newsletter subscriber');
  }
}
