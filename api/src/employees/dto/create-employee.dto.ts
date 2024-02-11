import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PayType } from 'src/types/pay.type';

export class CreateEmployeeDto {
    @ApiProperty({
        example: 'John',
        description: 'Employee\'s name',
    })
    @IsString()
    @IsNotEmpty()
    employee_name: string;

    @ApiProperty({
        example: 'Doe',
        description: 'Employee\'s last name',
    })
    @IsString()
    @IsNotEmpty()
    employee_lastname: string;

    @ApiProperty({
        example: 'salary',
        description: 'Employee\'s pay type',
        enum: PayType
    })
    @IsEnum(PayType)
    @IsNotEmpty()
    employee_pay_type: PayType;

    @ApiProperty({
        example: 480,
        description: 'Employee\'s pay rate',
    })
    @IsString()
    @IsNotEmpty()
    employee_pay_rate: number;

    @ApiProperty({
        example: 1,
        description: 'User ID associated with the employee',
    })
    @IsNotEmpty()
    @IsNumber()
    user_id: number;
}
