import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { DelegationController } from './delegation/delegation.controller';
import { MembersController } from './members/members.controller';
import { ObjectivesController } from './objectives/objectives.controller';
import { SubsidiariesController } from './subsidiaries/subsidiaries.controller';
import { DataStoreService } from './common/data-store.service';

@Module({
  imports: [],
  controllers: [AuthController, ObjectivesController, MembersController, DelegationController, SubsidiariesController],
  providers: [DataStoreService],
})
export class AppModule {}
