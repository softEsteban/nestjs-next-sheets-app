import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '../../types/user.type';

export class UpdateUserDto {
  @ApiProperty({
    example: 'Nombre ejemplo',
    description: 'Nombre del usuario',
  })
  @IsString()
  user_name: string;

  @ApiProperty({
    example: 'Apellido ejemplo',
    description: 'Apellido del usuario',
  })
  @IsString()
  user_lastname: string;

  @ApiProperty({
    example: 'User',
    description: 'Tipo del usuario',
    enum: UserType,
  })
  @IsEnum(UserType)
  user_type: UserType;

  @ApiProperty({
    example: 'password123',
    description: 'Contraseña del usuario',
  })
  @IsNotEmpty()
  user_password: string;

  @ApiProperty({
    example: 'email-example@gmail.com',
    description: 'Email del usuario',
  })
  @IsNotEmpty()
  @IsEmail()
  user_email: string;

  @ApiProperty({
    example: 1,
    description: 'Id del perfil del usuario',
  })
  @IsNotEmpty()
  profile_id: number;

  @ApiProperty({
    example: 'https://randomuser.me/api/portraits/women/1.jpg',
    description: 'Link del avatar del usuario',
  })
  @IsNotEmpty()
  @IsEmail()
  user_avatar: string;
}
