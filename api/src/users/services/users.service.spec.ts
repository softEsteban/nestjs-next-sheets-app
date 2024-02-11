import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';
import { UserType } from '../types/user.type';
import { ConflictException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  const mockUserRepository = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(user => Promise.resolve({
      id: Date.now(),
      ...user
    })),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService, {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository
        }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Test 1
  it('should throw ConflicException if user already exists', async () => {
    const dto = {
      user_name: "John",
      user_lastname: "Doe",
      user_type: UserType.CLIENT,
      user_password: "password123*ñ",
      user_email: "john-doe@gmail.com",
      user_avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      profile_id: 1
    };
    // Mock findOne method to return a user (existing user)
    mockUserRepository.findOne.mockResolvedValueOnce(dto);
    await expect(service.create(dto)).rejects.toThrow(ConflictException);
  })

  // Test 2
  it('should create a new user record and return it', async () => {
    const dto = {
      user_name: "John",
      user_lastname: "Doe",
      user_type: UserType.CLIENT,
      user_password: "password123*ñ",
      user_email: "john-doe555@gmail.com",
      user_avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      profile_id: 1
    };

    // Mock findOne method to return null (user does not exist)
    mockUserRepository.findOne.mockResolvedValueOnce(null);

    // Mock save method to return the created user
    const mockedId = 1;
    const mockedUser = {
      user_id: mockedId, // Mocked user ID
      user_created_at: expect.any(Date), // Mocked user creation date
      ...dto, // Mocked user data
    };
    mockUserRepository.save.mockResolvedValueOnce(mockedUser);

    // Call the create method and expect it to return the created user
    const createdUser = await service.create(dto);
    delete createdUser.user_password;

    // Validate returned value (exclude user_password from expectation)
    expect(createdUser).toEqual({
      user_id: mockedId, // Use the mocked ID here
      user_name: "John",
      user_lastname: "Doe",
      user_type: UserType.CLIENT,
      user_email: "john-doe555@gmail.com",
      user_avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      profile_id: 1,
      user_created_at: expect.any(Date), // We expect this to match any Date object
    });

    // Validate that findOne and save methods were called with the correct arguments
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { user_email: dto.user_email } });
    expect(mockUserRepository.save).toHaveBeenCalledWith(dto);
  });


    
});
