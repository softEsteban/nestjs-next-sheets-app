import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesService } from './employees.service';
import { Repository } from 'typeorm';
import { Employee } from '../../database/entities/employee.entity';
import { User } from '../../database/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserType } from '../../types/user.type';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { PayType } from '../../types/pay.type';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MinWages } from '../../database/entities/min.wages.entity';

describe('EmployeesService', () => {
  let service: EmployeesService;
  let employeeRepository: Repository<Employee>;
  let userRepository: Repository<User>;
  let minWagesRepository: Repository<MinWages>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        {
          provide: getRepositoryToken(Employee),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(MinWages),
          useValue: {
            find: jest.fn().mockResolvedValue([{ wage_name: 'Hour', wage_value: 12 }, { wage_name: 'Salary', wage_value: 480 }])
          },
        }
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
    employeeRepository = module.get<Repository<Employee>>(getRepositoryToken(Employee));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    minWagesRepository = module.get<Repository<MinWages>>(getRepositoryToken(MinWages));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create employee successfully and return it', async () => {
    // Mock data
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
      user_email: 'john.doe@example.com',
      user_password: 'password123',
      user_created_at: new Date(),
      profile_id: 1,
      user_avatar: 'avatar.jpg',
      profile: mockProfile,
      employees: []
    }

    // Mock findOne method to return the existing user
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

    // Mocking the employee repository to return a saved employee when create and save are called
    const createEmployeeDto: CreateEmployeeDto = {
      user_id: 1,
      employee_name: 'John',
      employee_lastname: 'Doe',
      employee_pay_type: PayType.SALARY,
      employee_pay_rate: 500
    };

    // Create a new instance of Employee and populate its properties
    const mockCreatedEmployee = new Employee();
    mockCreatedEmployee.employee_name = createEmployeeDto.employee_name;
    mockCreatedEmployee.employee_lastname = createEmployeeDto.employee_lastname;
    mockCreatedEmployee.employee_pay_type = createEmployeeDto.employee_pay_type;
    mockCreatedEmployee.employee_pay_rate = createEmployeeDto.employee_pay_rate;
    mockCreatedEmployee.employee_created_at = new Date();
    mockCreatedEmployee.user = mockUser;
    mockCreatedEmployee.employee_id = 1;

    // Mock the return values of create and save methods of employeeRepository
    jest.spyOn(employeeRepository, 'create').mockReturnValue(mockCreatedEmployee);
    jest.spyOn(employeeRepository, 'save').mockResolvedValue(mockCreatedEmployee);

    // Call the create method of the service
    const result = await service.create(createEmployeeDto);

    // Assert the result
    expect(result).toEqual(mockCreatedEmployee);
  });

  it('should return NotFoundException when related user doesnt exist', async () => {
    // Mocking user repository to return null when findOne is called
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

    // Create a new instance of CreateEmployeeDto
    const createEmployeeDto: CreateEmployeeDto = {
      user_id: 1,
      employee_name: 'John',
      employee_lastname: 'Doe',
      employee_pay_type: PayType.SALARY,
      employee_pay_rate: 500
    };

    // Call the create method of the service and expect it to throw a NotFoundException
    await expect(service.create(createEmployeeDto)).rejects.toThrow(NotFoundException);
  });

  it('should return BadRequestException when pay rate for hourly employee is lesser than minimum hour wage', async () => {
    // Mocking user repository to return a user when findOne is called

    const mockProfile = {
      profile_id: 1,
      profile_name: 'Mock Profile',
      profile_config: {}
    };

    const mockUser = new User();
    mockUser.user_id = 1;
    mockUser.user_name = 'John';
    mockUser.user_lastname = 'Doe';
    mockUser.user_type = UserType.CLIENT;
    mockUser.user_email = 'john.doe@example.com';
    mockUser.user_password = 'password123';
    mockUser.user_created_at = new Date();
    mockUser.profile_id = 1;
    mockUser.user_avatar = 'avatar.jpg';
    mockUser.profile = mockProfile;
    mockUser.employees = [];

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

    // Mocking the minWagesRepository to return a mock minimum wage value
    jest.spyOn(minWagesRepository, 'find').mockResolvedValue([{ wage_id: 2, wage_name: 'Hour', wage_value: 12 }]);

    // Mocking the employee repository to return a saved employee when create and save are called
    const createEmployeeDto: CreateEmployeeDto = {
      user_id: 1,
      employee_name: 'John',
      employee_lastname: 'Doe',
      employee_pay_type: PayType.HOURLY,
      employee_pay_rate: 10
    };

    // Create a new instance of Employee and populate its properties
    const mockCreatedEmployee = new Employee();
    mockCreatedEmployee.employee_name = createEmployeeDto.employee_name;
    mockCreatedEmployee.employee_lastname = createEmployeeDto.employee_lastname;
    mockCreatedEmployee.employee_pay_type = createEmployeeDto.employee_pay_type;
    mockCreatedEmployee.employee_pay_rate = createEmployeeDto.employee_pay_rate;
    mockCreatedEmployee.employee_created_at = new Date();
    mockCreatedEmployee.user = mockUser;
    mockCreatedEmployee.employee_id = 1;

    // Mock the return values of create and save methods of employeeRepository
    jest.spyOn(employeeRepository, 'create').mockReturnValue(mockCreatedEmployee);
    jest.spyOn(employeeRepository, 'save').mockResolvedValue(mockCreatedEmployee);

    // Call the create method of the service and expect it to throw a BadRequestException
    await expect(service.create(createEmployeeDto)).rejects.toThrow(BadRequestException);
  });

  it('should return BadRequestException when pay rate for salary employee is lesser than minimum salary wage', async () => {
    // Mocking user repository to return a user when findOne is called

    const mockProfile = {
      profile_id: 1,
      profile_name: 'Mock Profile',
      profile_config: {}
    };

    const mockUser = new User();
    mockUser.user_id = 1;
    mockUser.user_name = 'John';
    mockUser.user_lastname = 'Doe';
    mockUser.user_type = UserType.CLIENT;
    mockUser.user_email = 'john.doe@example.com';
    mockUser.user_password = 'password123';
    mockUser.user_created_at = new Date();
    mockUser.profile_id = 1;
    mockUser.user_avatar = 'avatar.jpg';
    mockUser.profile = mockProfile;
    mockUser.employees = [];

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

    // Mocking the minWagesRepository to return a mock minimum wage value
    jest.spyOn(minWagesRepository, 'find').mockResolvedValue([{ wage_id: 1, wage_name: 'Salary', wage_value: 480 }]);


    // Mocking the employee repository to return a saved employee when create and save are called
    const createEmployeeDto: CreateEmployeeDto = {
      user_id: 1,
      employee_name: 'John',
      employee_lastname: 'Doe',
      employee_pay_type: PayType.SALARY,
      employee_pay_rate: 300
    };

    // Create a new instance of Employee and populate its properties
    const mockCreatedEmployee = new Employee();
    mockCreatedEmployee.employee_name = createEmployeeDto.employee_name;
    mockCreatedEmployee.employee_lastname = createEmployeeDto.employee_lastname;
    mockCreatedEmployee.employee_pay_type = createEmployeeDto.employee_pay_type;
    mockCreatedEmployee.employee_pay_rate = createEmployeeDto.employee_pay_rate;
    mockCreatedEmployee.employee_created_at = new Date();
    mockCreatedEmployee.user = mockUser;
    mockCreatedEmployee.employee_id = 1;

    // Mock the return values of create and save methods of employeeRepository
    jest.spyOn(employeeRepository, 'create').mockReturnValue(mockCreatedEmployee);
    jest.spyOn(employeeRepository, 'save').mockResolvedValue(mockCreatedEmployee);

    // Call the create method of the service and expect it to throw a BadRequestException
    await expect(service.create(createEmployeeDto)).rejects.toThrow(BadRequestException);
  });

  it('should return all employees', async () => {
    // Mocking the employee repository to return an array of mock employees when find is called
    const mockEmployees: Employee[] = [
      {
        employee_id: 1,
        employee_name: 'John',
        employee_lastname: 'Doe',
        employee_pay_type: PayType.SALARY,
        employee_pay_rate: 500,
        employee_created_at: new Date(),
        user: null
      },
      {
        employee_id: 2,
        employee_name: 'Jane',
        employee_lastname: 'Doe',
        employee_pay_type: PayType.HOURLY,
        employee_pay_rate: 15,
        employee_created_at: new Date(),
        user: null
      }
    ];

    jest.spyOn(employeeRepository, 'find').mockResolvedValue(mockEmployees);

    // Call the findAll method of the service
    const result = await service.findAll();

    // Assert the result
    expect(result).toEqual(mockEmployees);
  });

  it('should return employees by user ID', async () => {
    //Mock data
    const userId = 1;
    const mockEmployees: Employee[] = [
      {
        employee_id: 1,
        employee_name: 'John',
        employee_lastname: 'Doe',
        employee_pay_type: PayType.SALARY,
        employee_pay_rate: 500,
        employee_created_at: new Date(),
        user: {
          user_id: 1,
          user_name: "",
          user_lastname: "",
          user_type: "",
          user_email: "",
          user_password: "",
          user_created_at: new Date,
          profile_id: 2,
          user_avatar: "",
          profile: {
            profile_config: {},
            profile_id: 1,
            profile_name: ""
          },
          employees: [],
        }
      },
      {
        employee_id: 2,
        employee_name: 'Jane',
        employee_lastname: 'Doe',
        employee_pay_type: PayType.HOURLY,
        employee_pay_rate: 15,
        employee_created_at: new Date(),
        user: {
          user_id: 1,
          user_name: "",
          user_lastname: "",
          user_type: "",
          user_email: "",
          user_password: "",
          user_created_at: new Date,
          profile_id: 2,
          user_avatar: "",
          profile: {
            profile_config: {},
            profile_id: 1,
            profile_name: ""
          },
          employees: [],
        }
      },
      {
        employee_id: 3,
        employee_name: 'John',
        employee_lastname: 'Doe',
        employee_pay_type: PayType.SALARY,
        employee_pay_rate: 500,
        employee_created_at: new Date(),
        user: {
          user_id: 3,
          user_name: "",
          user_lastname: "",
          user_type: "",
          user_email: "",
          user_password: "",
          user_created_at: new Date,
          profile_id: 2,
          user_avatar: "",
          profile: {
            profile_config: {},
            profile_id: 1,
            profile_name: ""
          },
          employees: [],
        }
      }
    ];

    // Mock the find method of employeeRepository to return the mockEmployees based on userId
    jest.spyOn(employeeRepository, 'find').mockResolvedValue(mockEmployees.filter(e => e.user.user_id === userId));

    // Call the findAllByUserId method of the service with the mocked userId
    const result = await service.findAllByUserId(userId);

    // Assert that the result matches the mocked employees
    expect(result).toEqual(mockEmployees.filter(e => e.user.user_id === userId));
  });

  it('should return employee by ID', async () => {
    //Mock data
    const employeeId = 1;
    const mockEmployee =
    {
      employee_id: 1,
      employee_name: 'John',
      employee_lastname: 'Doe',
      employee_pay_type: PayType.SALARY,
      employee_pay_rate: 500,
      employee_created_at: new Date(),
      user: {
        user_id: 1,
        user_name: "",
        user_lastname: "",
        user_type: "",
        user_email: "",
        user_password: "",
        user_created_at: new Date,
        profile_id: 2,
        user_avatar: "",
        profile: {
          profile_config: {},
          profile_id: 1,
          profile_name: ""
        },
        employees: [],
      }
    };

    // Mock the find method of employeeRepository to return one employee based by id
    jest.spyOn(employeeRepository, 'findOne').mockResolvedValue(mockEmployee);

    // Call the findOne method of the service by mocked id
    const result = await service.findOne(employeeId);

    // Assert that the result matches the mocked employee
    expect(result).toEqual(mockEmployee);
  });

  it('should throw NotFoundException if no employee is found by Id', async () => {
    //Mock data
    const employeeId = 2;

    // Mock the findOne method of employeeRepository to return null
    jest.spyOn(employeeRepository, 'findOne').mockResolvedValue(null);

    // Call the findOne method of the service with the mocked id and expect it to throw NotFoundException
    await expect(service.findOne(employeeId)).rejects.toThrow(NotFoundException);
  });

  it('should update employee successfully', async () => {
    // Mock data
    const employeeId = 1;
    const updatedEmployee = {
      employee_id: 1,
      employee_name: 'John Edited',
      employee_lastname: 'Doe',
      employee_pay_type: PayType.SALARY,
      employee_pay_rate: 500,
      employee_created_at: new Date(),
      user: {
        user_id: 1,
        user_name: "",
        user_lastname: "",
        user_type: "",
        user_email: "",
        user_password: "",
        user_created_at: new Date(),
        profile_id: 2,
        user_avatar: "",
        profile: {
          profile_config: {},
          profile_id: 1,
          profile_name: ""
        },
        employees: []
      }
    };
    const mockEmployee = {
      employee_id: 1,
      employee_name: 'John',
      employee_lastname: 'Doe',
      employee_pay_type: PayType.SALARY,
      employee_pay_rate: 500,
      employee_created_at: new Date(),
      user: {
        user_id: 1,
        user_name: "",
        user_lastname: "",
        user_type: "",
        user_email: "",
        user_password: "",
        user_created_at: new Date(),
        profile_id: 2,
        user_avatar: "",
        profile: {
          profile_config: {},
          profile_id: 1,
          profile_name: ""
        },
        employees: []
      }
    };

    // Mock the findOne method of employeeRepository to return the mockEmployee by id
    jest.spyOn(employeeRepository, 'findOne').mockResolvedValue(mockEmployee);

    // Mock the save method of employeeRepository
    jest.spyOn(employeeRepository, 'save').mockResolvedValue(updatedEmployee);

    // Call the update method of the service with the mocked id and updatedEmployee
    const result = await service.update(employeeId, updatedEmployee);

    // Assert that result matches the updated employee
    expect(result).toEqual(updatedEmployee);
  });

  it('should throw NotFoundException if no employee is found for the provided ID', async () => {
    //Mock data
    const employeeId = 2;
    const updatedEmployee = {
      employee_id: 2,
      employee_name: 'John Edited',
      employee_lastname: 'Doe',
      employee_pay_type: PayType.SALARY,
      employee_pay_rate: 500,
      employee_created_at: new Date(),
      user: {
        user_id: 1,
        user_name: "",
        user_lastname: "",
        user_type: "",
        user_email: "",
        user_password: "",
        user_created_at: new Date(),
        profile_id: 2,
        user_avatar: "",
        profile: {
          profile_config: {},
          profile_id: 1,
          profile_name: ""
        },
        employees: []
      }
    };

    // Mock the findOne method of employeeRepository to return null
    jest.spyOn(employeeRepository, 'findOne').mockResolvedValue(null);

    // Call the update method of the service with the mocked id and updateEmployee
    // and expect it to throw NotFoundException
    await expect(service.update(employeeId, updatedEmployee)).rejects.toThrow(NotFoundException);
  });

  it('should remove employee by Id', async () => {
    //Mock data
    const employeedId = 2;
    const mockEmployee = {
      employee_id: 2,
      employee_name: 'John',
      employee_lastname: 'Doe',
      employee_pay_type: PayType.SALARY,
      employee_pay_rate: 500,
      employee_created_at: new Date(),
      user: {
        user_id: 1,
        user_name: "",
        user_lastname: "",
        user_type: "",
        user_email: "",
        user_password: "",
        user_created_at: new Date(),
        profile_id: 2,
        user_avatar: "",
        profile: {
          profile_config: {},
          profile_id: 1,
          profile_name: ""
        },
        employees: []
      }
    };

    // Mock the findOne method of employeeRepository to return the mockEmployee based on id
    jest.spyOn(employeeRepository, 'findOne').mockResolvedValue(mockEmployee);

    // Mock the remove method of employeeRepository
    jest.spyOn(employeeRepository, 'remove').mockResolvedValue(null);

    // Call the remove method of the service with the mocked id
    await service.remove(employeedId);

    // Assert that remove method was called with the correct employee ID
    expect(employeeRepository.remove).toHaveBeenCalledWith(mockEmployee);
  });

});
