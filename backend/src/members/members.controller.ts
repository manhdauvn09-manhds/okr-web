import { Controller, Get } from '@nestjs/common';
import { DataStoreService } from '../common/data-store.service';
import { RequestUserId } from '../common/request-user';

@Controller('members')
export class MembersController {
  constructor(private readonly store: DataStoreService) {}

  @Get('objectives')
  memberObjectives(@RequestUserId() userId: number) {
    return { objectives: this.store.getMemberObjectivesForManager(userId) };
  }

  @Get('report')
  report(@RequestUserId() userId: number) {
    return { report: this.store.getMemberReport(userId) };
  }
}
