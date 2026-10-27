import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationalDocument } from './entities/organizational-document.entity';
import { OrganizationalDocumentsController } from './organizational-documents.controller';
import { OrganizationalDocumentsService } from './organizational-documents.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationalDocument])],
  controllers: [OrganizationalDocumentsController],
  providers: [OrganizationalDocumentsService],
  exports: [TypeOrmModule, OrganizationalDocumentsService],
})
export class OrganizationalDocumentsModule {}
