import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from '../../common/storage/storage.module';
import { InteractiveProgramme } from './entities/interactive-programme.entity';
import { InteractiveProgrammesController } from './interactive-programmes.controller';
import { InteractiveProgrammesService } from './interactive-programmes.service';

@Module({
  imports: [TypeOrmModule.forFeature([InteractiveProgramme]), StorageModule],
  controllers: [InteractiveProgrammesController],
  providers: [InteractiveProgrammesService],
  exports: [InteractiveProgrammesService, TypeOrmModule],
})
export class InteractiveProgrammesModule {}
