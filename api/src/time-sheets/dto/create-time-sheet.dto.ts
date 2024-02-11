import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateTimeSheetDto {
  @IsNotEmpty()
  @IsNumber()
  employee_id: number;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(12.0)
  hourly_rate: number;

  @IsNotEmpty()
  @IsNumber()
  hours: number;
}
