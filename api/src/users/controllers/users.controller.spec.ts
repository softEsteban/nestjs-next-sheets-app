import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { UserType } from '../../types/user.type';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from 'src/database/entities/user.entity';

describe('UsersController', () => {

  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn()
          }
        }
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);

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
    user_type: UserType.CLIENT,
    user_password: "password123*ñ",
    user_email: "john-doe555@gmail.com",
    user_avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    profile_id: 1,
    user_created_at: new Date(),
    profile: mockProfile,
    employees: []
  };
  const createUserDto: CreateUserDto = {
    user_name: "John",
    user_lastname: "Doe",
    user_type: UserType.CLIENT,
    user_password: "password123*ñ",
    user_email: "john-doe555@gmail.com",
    user_avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    profile_id: 1,
  };
  const updateUser = {
    user_name: "John",
    user_lastname: "Doe",
    user_type: UserType.CLIENT,
    user_password: "password123*ñ",
    user_email: "john-doe@gmail.com",
    user_avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    profile_id: 1
  };
  const users: User[] = [
    {
      user_id: 1,
      user_name: 'John',
      user_lastname: 'Doe',
      user_type: UserType.CLIENT,
      user_email: 'john.doe@example.com',
      profile_id: 1,
      user_avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      user_password: "",
      user_created_at: new Date(),
      employees: [],
      profile: mockProfile
    },
    {
      user_id: 2,
      user_name: 'Jane',
      user_lastname: 'Smith',
      user_type: UserType.ADMIN,
      user_email: 'jane.smith@example.com',
      profile_id: 2,
      user_avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      user_password: "",
      user_created_at: new Date(),
      employees: [],
      profile: mockProfile
    },
  ];

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create user', () => {
    it('should create a new user', async () => {

      jest.spyOn(service, 'create').mockResolvedValue(mockUser);

      const result = await controller.create(createUserDto);
      
      expect(result).toBe(mockUser);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('get all users and by id', () => {
    it('should return all users', async () => {
      
      jest.spyOn(service, 'findAll').mockResolvedValue(users);
      
      const result = await controller.findAll();
      
      expect(result).toBe(users);
      expect(service.findAll).toHaveBeenCalled();
    });
    
    it('should return an user by ID', async () => {
      const userId = '1';
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);

      const result = await controller.findOne(userId);

      expect(result).toBe(mockUser);
      expect(service.findOne).toHaveBeenCalledWith(+userId);
    });

  });

  describe('update user', () => {
    it('should update an user by ID', async () => {
      const id = '1';

      jest.spyOn(service, 'update').mockResolvedValue(mockUser);

      const result = await controller.update(id, updateUser);

      expect(result).toBe(mockUser);
      expect(service.update).toHaveBeenCalledWith(+id, updateUser);
    });
  });

  describe('delete user', () => {
    it('should delete an user by ID', async () => {
      const id = '1';
      jest.spyOn(service, 'remove').mockResolvedValue(null);

      const result = await controller.remove(id);

      expect(result).toBe(null);
      expect(service.remove).toHaveBeenCalledWith(+id);
    });
  });
});
