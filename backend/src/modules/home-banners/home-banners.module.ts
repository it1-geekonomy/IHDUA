import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from '../../common/storage/storage.module';
import { HomeBanner } from './entities/home-banner.entity';
import { HomeBannersController } from './home-banners.controller';
import { HomeBannersService } from './home-banners.service';

@Module({
  imports: [TypeOrmModule.forFeature([HomeBanner]), StorageModule],
  controllers: [HomeBannersController],
  providers: [HomeBannersService],
  exports: [HomeBannersService, TypeOrmModule],
})
export class HomeBannersModule {}
