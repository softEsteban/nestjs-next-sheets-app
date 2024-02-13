import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserType } from '../../types/user.type';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user successfully and return it', async () => {
    //Mock data
    const mockProfile = {
      profile_id: 1,
      profile_name: 'Mock Profile',
      profile_config: {}
    };
    const mockUser = {
      user_name: "John",
      user_lastname: "Doe",
      user_type: UserType.CLIENT,
      user_password: "password123*ñ",
      user_email: "john-doe555@gmail.com",
      user_avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      profile_id: 1,
      profile: mockProfile,
      employees: []
    };

    // Mock findOne method to return null (user does not exist)
    jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

    // Mock save method to return the created user
    const mockedId = 1;
    const mockedUser = {
      user_id: mockedId,
      user_created_at: expect.any(Date),
      ...mockUser,
    };

    jest.spyOn(userRepository, 'save').mockResolvedValueOnce(mockedUser);

    // Call the create method and expect it to return the created user
    const createdUser = await service.create(mockUser);
    delete createdUser.user_password;

    // Validate returned value (exclude user_password from expectation)
    expect(createdUser).toEqual(mockedUser);
  });

  it('should return all users', async () => {
    // Mock data
    const mockProfile = {
      profile_id: 1,
      profile_name: 'Mock Profile',
      profile_config: {}
    };
    const mockUsers = [
      {
        user_id: 1,
        user_name: 'John',
        user_lastname: 'Doe',
        user_type: UserType.CLIENT,
        user_email: "john-doe@gmail.com",
        profile_id: 2,
        user_avatar: "",
        user_created_at: new Date(),
        user_password: "",
        profile: mockProfile,
        employees: []
      },
      {
        user_id: 1,
        user_name: 'John 2',
        user_lastname: 'Doe',
        user_type: UserType.CLIENT,
        user_email: "john-doe@gmail.com",
        profile_id: 2,
        user_avatar: "",
        user_created_at: new Date(),
        user_password: "",
        profile: mockProfile,
        employees: []
      }
    ];

    jest.spyOn(userRepository, 'find').mockResolvedValue(mockUsers);

    // Call the findAll method of the service
    const result = await service.findAll();

    // Assert the result
    expect(result).toEqual(mockUsers);
  });

  it('should throw ConflicException if user already exists', async () => {

    //Mock data
    const mockProfile = {
      profile_id: 1,
      profile_name: 'Mock Profile',
      profile_config: {}
    };
    const mockedUser = {
      user_name: "John",
      user_lastname: "Doe",
      user_type: UserType.CLIENT,
      user_password: "password123*ñ",
      user_email: "john-doe@gmail.com",
      user_avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      profile_id: 1,
      user_created_at: new Date(),
      employees: [],
      user_id: 1,
      profile: mockProfile
    };

    // Mock findOne method to return a user (existing user)
    jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockedUser);

    await expect(service.create(mockedUser)).rejects.toThrow(ConflictException);
  });

  it('should return user by ID', async () => {
    //Mock data
    const userId = 1;
    const mockProfile = {
      profile_id: 1,
      profile_name: 'Mock Profile',
      profile_config: {}
    };
    const mockUser = {
      user_id: 1,
      user_name: 'John',
      user_lastname: 'Doe',
      user_type: UserType.CLIENT,
      user_email: "john-doe@gmail.com",
      profile_id: 2,
      user_avatar: "",
      user_created_at: new Date(),
      user_password: "",
      profile: mockProfile,
      employees: []
    };

    // Mock the find method of userRepository to return one user based by id
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

    // Call the findOne method of the service by mocked id
    const result = await service.findOne(userId);

    // Assert that the result matches the mocked user
    expect(result).toEqual(mockUser);
  });

  it('should throw NotFoundException if no user is found by Id', async () => {
    //Mock data
    const userId = 2;

    // Mock the findOne method of userRepository to return null
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

    // Call the findOne method of the service with the mocked id and expect it to throw NotFoundException
    await expect(service.findOne(userId)).rejects.toThrow(NotFoundException);
  });

  it('should update user successfully ', async () => {
    // Mock data
    const userId = 1;
    const mockProfile = {
      profile_id: 1,
      profile_name: 'Mock Profile',
      profile_config: {}
    };
    const updatedUser = {
      user_id: 1,
      user_name: "John EDITED",
      user_lastname: "Doe",
      user_type: UserType.CLIENT,
      user_created_at: new Date(),
      user_password: "password123*ñ",
      user_email: "john-doe555@gmail.com",
      user_avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      profile_id: 1,
      profile: mockProfile,
      employees: []
    };
    const mockUser = {
      user_id: 1,
      user_name: "John",
      user_lastname: "Doe",
      user_type: UserType.CLIENT,
      user_created_at: new Date(),
      user_password: "password123*ñ",
      user_email: "john-doe555@gmail.com",
      user_avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      profile_id: 1,
      profile: mockProfile,
      employees: []
    };

    // Mock the findOne method of userRepository to return the mockUser by id
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

    // Mock the save method of userRepository
    jest.spyOn(userRepository, 'save').mockResolvedValue(updatedUser);

    // Call the update method of the service with the mocked id and updatedUser
    const result = await service.update(userId, updatedUser);

    // Assert that result matches the updated user
    expect(result).toEqual(updatedUser);

  });

  it('should throw NotFoundException if no user is found for the provided ID', async () => {
    //Mock data
    const userId = 1;
    const updatedUser = {
      user_id: 1,
      user_name: "John EDITED",
      user_lastname: "Doe",
      user_type: UserType.CLIENT,
      user_created_at: new Date(),
      user_password: "password123*ñ",
      user_email: "john-doe555@gmail.com",
      user_avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      profile_id: 1,
      employees: []
    };

    // Mock the findOne method of userRepository to return null
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

    // Call the update method of the service with the mocked id and updateUser
    // and expect it to throw NotFoundException
    await expect(service.update(userId, updatedUser)).rejects.toThrow(NotFoundException);
  });

  it('should remove user by Id', async () => {
    //Mock data
    const userId = 2;
    const mockProfile = {
      profile_id: 1,
      profile_name: 'Mock Profile',
      profile_config: {}
    };
    const mockUser = {
      user_id: 1,
      user_name: 'John',
      user_lastname: 'Doe',
      user_type: UserType.CLIENT,
      user_email: "john-doe@gmail.com",
      profile_id: 2,
      user_avatar: "",
      user_created_at: new Date(),
      user_password: "",
      profile: mockProfile,
      employees: []
    };

    // Mock the findOne method of userRepository to return the mockUser based on id
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

    // Mock the remove method of userRepository
    jest.spyOn(userRepository, 'remove').mockResolvedValue(null);

    // Call the remove method of the service with the mocked id
    await service.remove(userId);

    // Assert that remove method was called with the correct user ID
    expect(userRepository.remove).toHaveBeenCalledWith(mockUser);
  });

  it('should hash the password using bcrypt', async () => {
    // Mock data
    const password = 'password123';

    // Stub the bcrypt.hash method to return a known hash value
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('mockedHashedPassword');

    // Call the hashPassword method with the mock password
    const hashedPassword = await service['hashPassword'](password);

    // Assert that bcrypt.hash was called with the correct password and salt rounds
    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);

    // Assert that the method returned the expected hashed password
    expect(hashedPassword).toBe('mockedHashedPassword');
  });

});
