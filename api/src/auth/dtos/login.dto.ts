import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        example: 'email-example@gmail.com',
        description: 'User email',
    })
    @IsNotEmpty()
    @IsEmail()
    user_email: string;

    @ApiProperty({
        example: 'password123',
        description: 'User password',
    })
    @IsNotEmpty()
    user_password: string;

}