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
  hours: number;

  @ApiProperty({
    example: '2024-02-20',
    description: 'Pay date',
  })
  @IsDateString()
  check_date: Date;
}
