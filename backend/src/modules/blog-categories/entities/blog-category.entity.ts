import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { BlogAndStory } from '../../blogs-and-stories/entities/blog-and-story.entity';

@Entity('blog_categories')
export class BlogCategory extends BaseEntity {
  @ApiProperty({ example: 'Healthcare & Medical' })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({ example: 'healthcare-and-medical' })
  @Column({ type: 'varchar', length: 120, unique: true })
  slug: string;

  @OneToMany(() => BlogAndStory, (blog) => blog.category)
  blogs?: BlogAndStory[];
}
