import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { UserType } from '../../types/user.type';


describe('UsersController', () => {

  let controller: UsersController;
  const mockUserService = {
    create: jest.fn(dto => {
      return {
        user_id: Date.now(),
        ...dto
      }
    }),
    update: jest.fn().mockImplementation(
      (id, dto) => ({
        id,
        ...dto
      })
    ),
    findAll: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UsersController>(UsersController);

  });


  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Mock data
  const dto = {
    user_name: "John",
    user_lastname: "Doe",
    user_type: UserType.CLIENT,
    user_password: "password123*ñ",
    user_email: "john-doe@gmail.com",
    user_avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    profile_id: 1
  };

  const mockUsers = [
    {
      user_id: 1,
      user_name: 'John',
      user_lastname: 'Doe',
      user_type: UserType.CLIENT,
      user_email: 'john.doe@example.com',
      profile_id: 1,
      user_avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
      user_id: 2,
      user_name: 'Jane',
      user_lastname: 'Smith',
      user_type: UserType.ADMIN,
      user_email: 'jane.smith@example.com',
      profile_id: 2,
      user_avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
  ];

  // Test 1
  it('should create a user', () => {
    expect(controller.create(dto)).toEqual({
      user_id: expect.any(Number),
      user_name: "John",
      user_lastname: "Doe",
      user_type: UserType.CLIENT,
      user_password: "password123*ñ",
      user_email: "john-doe@gmail.com",
      user_avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      profile_id: 1,
    });
    expect(mockUserService.create).toHaveBeenCalledWith(dto);
  })

  //Test 2
  it('should update a user', () => {
    expect(controller.update('1', dto)).toEqual({
      id: 1,
      ...dto
    })
    expect(mockUserService.update).toHaveBeenCalled();
  })

  //Test 3
  it('should return all users', async () => {
    expect(controller.findAll()).toEqual(mockUsers);
    expect(mockUserService.findAll).toHaveBeenCalled();
  })


});
