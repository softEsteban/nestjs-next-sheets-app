import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserType } from '../../types/user.type';
import { Repository } from 'typeorm';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: Repository
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue("your_access_token")
          }
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

  });

  const mockLoginDto = {
    user_email: "john-doe-notfound@gmail.com",
    user_password: "password123"
  };

  describe('login', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should throw a NotFoundException if user is not found', async () => {

      userRepository.findOne = jest.fn().mockResolvedValueOnce(null);

      await expect(service.login(mockLoginDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw a UnauthorizedException if user password is incorrect', async () => {
      const foundUser = {
        user_name: "John",
        user_lastname: "Doe",
        user_type: UserType.CLIENT,
        user_password: "password123*ñ",
        user_email: "john-doe@gmail.com",
        user_avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        profile_id: 1
      };

      userRepository.findOne = jest.fn().mockResolvedValueOnce(foundUser);

      await expect(service.login(mockLoginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

});
