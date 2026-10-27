import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogCategoriesModule } from '../blog-categories/blog-categories.module';
import { BlogCategory } from '../blog-categories/entities/blog-category.entity';
import { BlogsAndStoriesController } from './blogs-and-stories.controller';
import { BlogsAndStoriesService } from './blogs-and-stories.service';
import { BlogAndStory } from './entities/blog-and-story.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogAndStory, BlogCategory]),
    BlogCategoriesModule,
  ],
  controllers: [BlogsAndStoriesController],
  providers: [BlogsAndStoriesService],
  exports: [BlogsAndStoriesService],
})
export class BlogsAndStoriesModule {}
