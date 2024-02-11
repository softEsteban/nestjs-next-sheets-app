import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags("Users Module")
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Retrieve all registered users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Retrieve a single user by ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update a user by ID' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete a user by ID' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
