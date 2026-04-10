import { Body, Controller, Get, Post } from '@nestjs/common';
import { IsInt } from 'class-validator';
import { DataStoreService } from '../common/data-store.service';
import { RequestUserId } from '../common/request-user';

class AssignDto {
  @IsInt()
  memberId!: number;

  @IsInt()
  targetManagerId!: number;
}

class PromoteDto {
  @IsInt()
  memberId!: number;
}

@Controller('delegation')
export class DelegationController {
  constructor(private readonly store: DataStoreService) {}

  @Get('team')
  getTeam(@RequestUserId() userId: number) {
    return { members: this.store.getTeamMembers(userId) };
  }

  @Get('managers')
  getManagers() {
    return { managers: this.store.getAllManagers() };
  }

  @Post('assign')
  assign(@RequestUserId() userId: number, @Body() body: AssignDto) {
    return this.store.assignMember(userId, body.memberId, body.targetManagerId);
  }

  @Post('promote')
  promote(@RequestUserId() userId: number, @Body() body: PromoteDto) {
    return this.store.promoteMember(userId, body.memberId);
  }
}
