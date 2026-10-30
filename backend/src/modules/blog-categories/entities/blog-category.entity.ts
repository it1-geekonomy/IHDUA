import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { BlogAndStory } from '../../blogs-and-stories/entities/blog-and-story.entity';

@Entity('blog_categories')
export class BlogCategory extends BaseEntity {
  @ApiProperty({
    example: 'Healthcare & Medical',
    description: 'Name of the blog category',
    maxLength: 100,
  })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @OneToMany(() => BlogAndStory, (blog) => blog.category)
  blogs?: BlogAndStory[];
}
