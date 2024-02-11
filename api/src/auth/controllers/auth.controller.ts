import { Controller, Get, Post, Body, UseGuards, Put, Param } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { User } from '../../database/entities/user.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../dtos/login.dto';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { UpdateUserDto } from '../dtos/update.user.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags("Authentication Module")
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @ApiOperation({ summary: 'Login to API and get token' })
    @ApiResponse({ status: 200, description: 'Login' })
    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<any> {
        return await this.authService.login(loginDto);
    }

    // @UseGuards(AuthGuard('jwt'))
    // @ApiOperation({ summary: 'Obtener todos los usuarios' })
    // @Get()
    // async findAll(): Promise<User[]> {
    //     return await this.authService.findAll();
    // }

    // @UseGuards(AuthGuard('jwt'))
    // @ApiOperation({ summary: 'Crear un nuevo usuario' })
    // @ApiResponse({ status: 201, description: 'Crear usuarios' })
    // @Post()
    // async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    //     return await this.authService.create(createUserDto);
    // }

    // @UseGuards(AuthGuard('jwt'))
    // @ApiOperation({ summary: 'Actualizar información de usuario' })
    // @ApiResponse({ status: 200, description: 'Usuario actualizado' })
    // @Put(':id') 
    // async update(@Param('id') userId: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    //     return await this.authService.update(userId, updateUserDto);
    // }
}