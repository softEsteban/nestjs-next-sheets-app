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

  const mockProfile = {
    profile_id: 1,
    profile_name: 'Mock Profile',
    profile_config: {}
  };
  const mockUser = {
    user_id: 1,
    user_name: "John",
    user_lastname: "Doe",
    user_created_at: new Date(),
    user_type: UserType.CLIENT,
    user_password: "password123*ñ",
    user_email: "john-doe555@gmail.com",
    user_avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    profile_id: 1,
    profile: mockProfile,
    employees: []
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create user', () => {
    it('should create user successfully and return it', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      const mockedId = 1;
      const mockedUser = {
        user_id: mockedId,
        user_created_at: expect.any(Date),
        ...mockUser,
      };

      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(mockedUser);

      const createdUser = await service.create(mockUser);
      delete createdUser.user_password;

      expect(createdUser).toEqual(mockedUser);
    });
  });

  describe('get all users and by id', () => {
    it('should return all users', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValue(mockUsers);
      
      const result = await service.findAll();
      
      expect(result).toEqual(mockUsers);
    });

    it('should throw ConflicException if user already exists', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser);

      await expect(service.create(mockUser)).rejects.toThrow(ConflictException);
    });

    it('should return user by ID', async () => {
      const userId = 1;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      const result = await service.findOne(userId);

      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if no user is found by Id', async () => {
      const userId = 2;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update user', () => {
    it('should update user successfully ', async () => {
      const userId = 1;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      jest.spyOn(userRepository, 'save').mockResolvedValue(updatedUser);

      const result = await service.update(userId, updatedUser);

      expect(result).toEqual(updatedUser);

    });

    it('should throw NotFoundException if no user is found for the provided ID', async () => {
      const userId = 1;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.update(userId, updatedUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove user', () => {
    it('should remove user by Id', async () => {
      const userId = 2;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      jest.spyOn(userRepository, 'remove').mockResolvedValue(null);

      await service.remove(userId);

      expect(userRepository.remove).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('auth utils', () => {
    it('should hash the password using bcrypt', async () => {
      const password = 'password123';

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('mockedHashedPassword');

      const hashedPassword = await service['hashPassword'](password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);

      expect(hashedPassword).toBe('mockedHashedPassword');
    });
  });
});
