import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateObjectiveDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  quarter!: string;

  @IsEnum(['PERSONAL', 'TEAM'])
  type!: 'PERSONAL' | 'TEAM';
}

export class AddKrDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsNumber()
  startValue!: number;

  @IsNumber()
  targetValue!: number;

  @IsDateString()
  deadline!: string;
}

export class UpdateKrProgressDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  progress!: number;
}
