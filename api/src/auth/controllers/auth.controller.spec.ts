import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { UserType } from '../../types/user.type';
import { LoginDto } from '../dtos/login.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  const mockUser = {
    user: {
      user_id: 13,
      user_name: "John",
      user_lastname: "Doe",
      user_type: UserType.CLIENT,
      user_email: "john-doe@gmail.com",
      user_avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      user_created_at: "2024-02-12T04:10:53.669Z",
      profile_id: 2,
      profile: {
        profile_id: 2,
        profile_name: "CLIENT PROFILE",
        profile_config: [
          {
            menu_id: "1",
            children: [],
            menu_icon: "FaHome",
            menu_link: "/home",
            menu_name: "Home"
          },
          {
            menu_id: "2",
            children: [
              {
                menu_id: "1",
                children: [],
                menu_icon: "FaHardHat",
                menu_link: "/employees",
                menu_name: "Employees"
              },
              {
                menu_id: "2",
                children: [],
                menu_icon: "FaClock",
                menu_link: "/time-sheets",
                menu_name: "Time Sheets"
              }
            ],
            menu_icon: "FaBars",
            menu_link: "",
            menu_name: "Employees Management"
          }
        ]
      }
    },
    token: ""
  };
  const loginDto: LoginDto = {
    user_email: "john-doe@gmail.com",
    user_password: "password123*N"
  };

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should let a user login and return a JWT token', async () => {

      const accessToken = "any_token";

      const serviceMock = {
        login: jest.fn().mockResolvedValue({ user: mockUser, token: accessToken })
      };

      jest.spyOn(service, 'login').mockImplementation(serviceMock.login);

      const result = await controller.login(loginDto);

      expect(result).toEqual({
        user: mockUser,
        token: accessToken
      });

      expect(service.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw UnauthorizedException when the password is incorrect', async () => {

      jest.spyOn(service, 'login').mockRejectedValue(new UnauthorizedException("Password is incorrect"));

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw NotFoundException when the user is not found', async () => {
      jest.spyOn(service, 'login').mockRejectedValue(new NotFoundException("User was not found"));

      await expect(controller.login(loginDto)).rejects.toThrow(NotFoundException);
    });

  });

});
