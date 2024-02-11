import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '../../auth/types/user.type';

export class CreateUserDto {
  @ApiProperty({
    example: 'John',
    description: 'User\'s name',
  })
  @IsString()
  user_name: string;
  
  @ApiProperty({
    example: 'Doe',
    description: 'User\'s lastname',
  })
  @IsString()
  user_lastname: string;

  @ApiProperty({
    example: 'client',
    description: 'User type',
    enum: UserType,
  })
  @IsEnum(UserType)
  user_type: UserType;

  @ApiProperty({
    example: 'password123',
    description: 'User\'s password',
  })
  @IsNotEmpty()
  user_password: string;
 
  @ApiProperty({
    example: 'john-doe@gmail.com',
    description: 'User\'s email',
  })
  @IsNotEmpty()
  @IsEmail()
  user_email: string;

  @ApiProperty({
    example: 1,
    description: 'User\'s profile config ID',
  })
  @IsNotEmpty()
  profile_id: number;

  @ApiProperty({
    example: 'https://randomuser.me/api/portraits/women/1.jpg',
    description: 'User\'s avatar link',
  })
  @IsNotEmpty()
  user_avatar: string;

}
