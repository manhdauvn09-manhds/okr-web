import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { IsInt, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { DataStoreService } from '../common/data-store.service';
import { RequestUserId } from '../common/request-user';
import { AddKrDto, CreateObjectiveDto, UpdateKrProgressDto } from './objective.dto';

class SelfReportDto {
  @IsNumber() @Min(0) @Max(200) percent!: number;
}

class GradeDto {
  @IsInt() @Min(1) @Max(5) stars!: number;
  @IsString() @IsNotEmpty() comment!: string;
}

@Controller('objectives')
export class ObjectivesController {
  constructor(private readonly store: DataStoreService) {}

  @Get()
  list(@RequestUserId() userId: number) {
    return { objectives: this.store.getObjectivesForViewer(userId) };
  }

  @Get(':id')
  detail(@RequestUserId() userId: number, @Param('id', ParseIntPipe) id: number) {
    return { objective: this.store.getObjectiveDetail(userId, id) };
  }

  @Post()
  create(@RequestUserId() userId: number, @Body() body: CreateObjectiveDto) {
    return { objective: this.store.createObjective(userId, body) };
  }

  @Post(':id/key-results')
  addKr(
    @RequestUserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AddKrDto,
  ) {
    return { objective: this.store.addKr(userId, id, body) };
  }

  @Delete(':id/key-results/:krId')
  deleteKr(
    @RequestUserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Param('krId', ParseIntPipe) krId: number,
  ) {
    return { objective: this.store.deleteKr(userId, id, krId) };
  }

  @Post(':id/submit')
  submit(@RequestUserId() userId: number, @Param('id', ParseIntPipe) id: number) {
    return { objective: this.store.submitObjective(userId, id) };
  }

  @Patch(':id/key-results/:krId/progress')
  updateProgress(
    @RequestUserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Param('krId', ParseIntPipe) krId: number,
    @Body() body: UpdateKrProgressDto,
  ) {
    return { objective: this.store.updateKrProgress(userId, id, krId, body) };
  }

  @Patch(':id/key-results/:krId/self-report')
  selfReport(
    @RequestUserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Param('krId', ParseIntPipe) krId: number,
    @Body() body: SelfReportDto,
  ) {
    return { objective: this.store.selfReportKr(userId, id, krId, body.percent) };
  }

  @Post(':id/grade')
  grade(
    @RequestUserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: GradeDto,
  ) {
    return { objective: this.store.gradeObjective(userId, id, body) };
  }
}
