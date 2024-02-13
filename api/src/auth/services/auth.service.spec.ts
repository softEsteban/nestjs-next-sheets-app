import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserType } from '../../types/user.type';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersRepository = {
    findOne: jest.fn(),
  }

  const mockJwtService = {
    sign: jest.fn().mockImplementation( ()=> {
      return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG4tZG9lQGdtYWlsLmNvbSIsInN1YiI6IkpvaG4iLCJpYXQiOjE3MDc2Njc0MjEsImV4cCI6MTcwNzc1MzgyMX0.Ol9sBbE6qowSesvaOrUPrwcJdq2qfmmq63cl3pQOC2U";
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService, 
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Test 1
  it('should throw a NotFoundException if user is not found', async () => {
    const dto = {
      user_email: "john-doe-notfound@gmail.com",
      user_password: "password123"
    };

    // Mock findOne method to return a user (not existing user)
    mockUsersRepository.findOne.mockResolvedValueOnce(null);
    
    // Test login service
    try {
      await service.login(dto);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toEqual("User was not found");
    }
  })

  // Test 2
  it('should throw a UnauthorizedException if user password is incorrect', async () => {
    const dto = {
      user_email: "john-doe@gmail.com",
      user_password: "password123*N"
    };

    const foundUser = {
      user_name: "John",
      user_lastname: "Doe",
      user_type: UserType.CLIENT,
      user_password: "password123*ñ",
      user_email: "john-doe@gmail.com",
      user_avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      profile_id: 1
    };

    // Mock findOne method to return a user (existing user)
    mockUsersRepository.findOne.mockResolvedValueOnce(foundUser);

    // Test login service
    try {
      await service.login(dto);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toEqual("Password is incorrect")
    }
  })

});
