import { Controller, Get } from '@nestjs/common';
import { DataStoreService } from '../common/data-store.service';
import { RequestUserId } from '../common/request-user';

@Controller('subsidiaries')
export class SubsidiariesController {
  constructor(private readonly store: DataStoreService) {}

  @Get()
  getSubsidiaries(@RequestUserId() userId: number) {
    return this.store.getSubsidiaries(userId);
  }
}
