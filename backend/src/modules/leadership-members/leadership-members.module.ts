import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from '../../common/storage/storage.module';
import { LeadershipMember } from './entities/leadership-member.entity';
import { LeadershipMembersController } from './leadership-members.controller';
import { LeadershipMembersService } from './leadership-members.service';

@Module({
  imports: [TypeOrmModule.forFeature([LeadershipMember]), StorageModule],
  controllers: [LeadershipMembersController],
  providers: [LeadershipMembersService],
  exports: [LeadershipMembersService, TypeOrmModule],
})
export class LeadershipMembersModule {}
