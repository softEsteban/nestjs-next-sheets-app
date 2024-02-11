import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.user_password = await this.hashPassword(createUserDto.user_password);
    createUserDto["user_created_at"] = new Date();
    return this.userRepository.save(createUserDto);
  }

  async update(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { user_id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user properties based on updateUserDto
    if (updateUserDto.user_name) {
      user.user_name = updateUserDto.user_name;
    }
    if (updateUserDto.user_lastname) {
      user.user_lastname = updateUserDto.user_lastname;
    }
    if (updateUserDto.user_type) {
      user.user_type = updateUserDto.user_type;
    }
    if (updateUserDto.user_avatar) {
      user.user_avatar = updateUserDto.user_avatar;
    }
    delete user["user_password"];

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({ select: ['user_id', 'user_name', 'user_lastname', 'user_type', 'user_email', 'profile_id', 'user_avatar'] });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      select: {
        user_name: true,
        user_lastname: true,
        user_type: true,
        user_email: true,
        user_created_at: true,
        user_avatar: true,
      },
      where: {
        user_id: id
      }
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id); 
    await this.userRepository.delete(user);
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

}
