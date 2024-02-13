import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dtos/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) { }

    async login(loginDto: LoginDto) {
        const { user_email, user_password } = loginDto;

        // Find the user by email in your user database. Include profile relation
        const user = await this.userRepository.findOne({
            where: { user_email },
            relations: ['profile'],
        });

        if (!user) {
            // User not found
            throw new NotFoundException("User was not found");
        }

        // Compare the provided password with the stored password hash
        const isPasswordValid = await this.comparePasswords(user_password, user.user_password);

        if (!isPasswordValid) {
            throw new UnauthorizedException("Password is incorrect");
        }

        // Generate a JWT token
        const payload = { email: user.user_email, sub: user.user_name };
        const accessToken = this.jwtService.sign(payload);
        delete user["user_password"];

        return { user, token: accessToken };
    }

    private async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}