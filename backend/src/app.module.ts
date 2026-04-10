import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { MembersController } from './members/members.controller';
import { ObjectivesController } from './objectives/objectives.controller';
import { DataStoreService } from './common/data-store.service';

@Module({
  imports: [],
  controllers: [AuthController, ObjectivesController, MembersController],
  providers: [DataStoreService],
})
export class AppModule {}
