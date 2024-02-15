import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTimeSheetDto {

  @ApiProperty({
    example: 12,
    description: 'Employee\'s id',
  })
  @IsNotEmpty()
  @IsNumber()
  employee_id: number;

  @ApiProperty({
    example: 0,
    description: 'Employee\'s hours, when hourly based',
  })
  @IsNumber()
  sheet_hours: number;

  @ApiProperty({
    example: 0,
    description: 'Employee\'s pay rate',
  })
  @IsNumber()
  @IsNotEmpty()
  sheet_pay_rate: number;

  @ApiProperty({
    example: '2024-02-20',
    description: 'Pay date',
  })
  @IsDateString()
  @IsNotEmpty()
  sheet_check_date: Date;
}
