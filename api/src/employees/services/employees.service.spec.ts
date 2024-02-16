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
  };
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
    },
    time_sheets: []
  };
  const createEmployeeSalaryDto: CreateEmployeeDto = {
    user_id: 1,
    employee_name: 'John',
    employee_lastname: 'Doe',
    employee_pay_type: PayType.SALARY,
    employee_pay_rate: 500
  };
  const createEmployeeHourlyDto: CreateEmployeeDto = {
    user_id: 1,
    employee_name: 'John',
    employee_lastname: 'Doe',
    employee_pay_type: PayType.HOURLY,
    employee_pay_rate: 10
  };
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
    },
    time_sheets: []
  };
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
      },
      time_sheets: []
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
      },
      time_sheets: []
    }
  ];

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create employee', () => {
    it('should create employee successfully and return it', async () => {

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      const mockCreatedEmployee = {
        employee_name: createEmployeeSalaryDto.employee_name,
        employee_lastname: createEmployeeSalaryDto.employee_lastname,
        employee_pay_type: createEmployeeSalaryDto.employee_pay_type,
        employee_pay_rate: createEmployeeSalaryDto.employee_pay_rate,
        employee_created_at: new Date(),
        user: mockUser,
        employee_id: 1,
        time_sheets: []
      };

      jest.spyOn(employeeRepository, 'create').mockReturnValue(mockCreatedEmployee);
      jest.spyOn(employeeRepository, 'save').mockResolvedValue(mockCreatedEmployee);

      const result = await service.create(createEmployeeSalaryDto);

      expect(result).toEqual(mockCreatedEmployee);
    });

    it('should return NotFoundException when related user doesnt exist', async () => {

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.create(createEmployeeSalaryDto)).rejects.toThrow(NotFoundException);
    });

    it('should return BadRequestException when pay rate for hourly employee is lesser than minimum hour wage', async () => {

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      jest.spyOn(minWagesRepository, 'find').mockResolvedValue([{ wage_id: 2, wage_name: 'Hour', wage_value: 12 }]);

      const mockCreatedEmployee = {
        employee_name : createEmployeeHourlyDto.employee_name,
        employee_lastname : createEmployeeHourlyDto.employee_lastname,
        employee_pay_type : createEmployeeHourlyDto.employee_pay_type,
        employee_pay_rate : createEmployeeHourlyDto.employee_pay_rate,
        employee_created_at : new Date(),
        user : mockUser,
        employee_id : 1,
        time_sheets: []
      }

      jest.spyOn(employeeRepository, 'create').mockReturnValue(mockCreatedEmployee);
      jest.spyOn(employeeRepository, 'save').mockResolvedValue(mockCreatedEmployee);

      await expect(service.create(createEmployeeHourlyDto)).rejects.toThrow(BadRequestException);
    });

    it('should return BadRequestException when pay rate for salary employee is lesser than minimum salary wage', async () => {
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
      jest.spyOn(minWagesRepository, 'find').mockResolvedValue([{ wage_id: 1, wage_name: 'Salary', wage_value: 480 }]);

      const createEmployeeDto: CreateEmployeeDto = {
        user_id: 1,
        employee_name: 'John',
        employee_lastname: 'Doe',
        employee_pay_type: PayType.SALARY,
        employee_pay_rate: 300
      };

      const mockCreatedEmployee = new Employee();
      mockCreatedEmployee.employee_name = createEmployeeDto.employee_name;
      mockCreatedEmployee.employee_lastname = createEmployeeDto.employee_lastname;
      mockCreatedEmployee.employee_pay_type = createEmployeeDto.employee_pay_type;
      mockCreatedEmployee.employee_pay_rate = createEmployeeDto.employee_pay_rate;
      mockCreatedEmployee.employee_created_at = new Date();
      mockCreatedEmployee.user = mockUser;
      mockCreatedEmployee.employee_id = 1;

      jest.spyOn(employeeRepository, 'create').mockReturnValue(mockCreatedEmployee);
      jest.spyOn(employeeRepository, 'save').mockResolvedValue(mockCreatedEmployee);

      await expect(service.create(createEmployeeDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('get all employees and by id', () => {
    it('should return all employees', async () => {

      jest.spyOn(employeeRepository, 'find').mockResolvedValue(mockEmployees);

      const result = await service.findAll();

      expect(result).toEqual(mockEmployees);
    });

    it('should return employees by user ID', async () => {
      const userId = 1;

      jest.spyOn(employeeRepository, 'find').mockResolvedValue(mockEmployees.filter(e => e.user.user_id === userId));

      const result = await service.findAllByUserId(userId);

      expect(result).toEqual(mockEmployees.filter(e => e.user.user_id === userId));
    });

    it('should return employee by ID', async () => {
      const employeeId = 1;

      jest.spyOn(employeeRepository, 'findOne').mockResolvedValue(mockEmployee);

      const result = await service.findOne(employeeId);

      expect(result).toEqual(mockEmployee);
    });

    it('should throw NotFoundException if no employee is found by Id', async () => {
      const employeeId = 2;

      jest.spyOn(employeeRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(employeeId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update employee', () => {
    it('should update employee successfully', async () => {
      const employeeId = 1;

      jest.spyOn(employeeRepository, 'findOne').mockResolvedValue(mockEmployee);

      jest.spyOn(employeeRepository, 'save').mockResolvedValue(updatedEmployee);

      const result = await service.update(employeeId, updatedEmployee);

      expect(result).toEqual(updatedEmployee);
    });

    it('should throw NotFoundException if no employee is found for the provided ID', async () => {
      const employeeId = 2;

      jest.spyOn(employeeRepository, 'findOne').mockResolvedValue(null);

      await expect(service.update(employeeId, updatedEmployee)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove employee', () => {
    it('should remove employee by Id', async () => {
      const employeedId = 2;

      jest.spyOn(employeeRepository, 'findOne').mockResolvedValue(mockEmployee);

      jest.spyOn(employeeRepository, 'remove').mockResolvedValue(null);

      await service.remove(employeedId);

      expect(employeeRepository.remove).toHaveBeenCalledWith(mockEmployee);
    });
  });

});
