import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { UserType } from '../../types/user.type';

describe('AuthController', () => {

  // Mock data
  const dto = {
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
        profile_name: "CLIENT PROFILE", // Added profile_name
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

  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn().mockImplementation(async () => {
      return dto;
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService
        }
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Test 1
it('should login', async () => {
  const loginDto = {
    user_email: "john-doe@gmail.com",
    user_password: "password123*N"
  };

  // Since the login method returns a promise, await it
  const result = await controller.login(loginDto);

  // Expect the result to equal the expected object
  expect(result).toEqual({
    user: {
      user_id: 13,
      user_name: "John",
      user_lastname: "Doe",
      user_type: "client",
      user_email: "john-doe@gmail.com",
      user_avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      user_created_at: expect.any(String),
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
    token: expect.any(String)
  });

  // Expect the mockAuthService.login method to have been called with the provided loginDto
  expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
});





});
