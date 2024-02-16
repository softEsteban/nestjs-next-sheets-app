import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from '../services/employees.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { PayType } from '../../types/pay.type';
import { Employee } from '../../database/entities/employee.entity';

describe('EmployeesController', () => {
  let controller: EmployeesController;
  let service: EmployeesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeesController],
      providers: [
        {
          provide: EmployeesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            findAllByUserId: jest.fn(),
            update: jest.fn(),
            remove: jest.fn()
          }
        }
      ],
    }).compile();

    controller = module.get<EmployeesController>(EmployeesController);
    service = module.get<EmployeesService>(EmployeesService);
  });

  const mockEmployee: Employee = {
    employee_id: 1,
    employee_name: "John",
    employee_lastname: "Doe",
    employee_pay_rate: 12,
    employee_pay_type: PayType.HOURLY,
    user: {
      user_name: "",
      user_lastname: "",
      user_type: "",
      user_created_at: new Date(),
      user_email: "",
      user_password: "",
      user_id: 1,
      profile_id: 1,
      profile: {
        profile_id: 1,
        profile_name: "",
        profile_config: {}
      },
      user_avatar: "",
      employees: []
    },
    time_sheets: [],
    employee_created_at: new Date()
  };
  const createEmployeeDto: CreateEmployeeDto = {
    employee_name: "John",
    employee_lastname: "Doe",
    employee_pay_rate: 12,
    employee_pay_type: PayType.HOURLY,
    user_id: 1
  };
  const updatedEmployee: Employee = {
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
  const employees: Employee[] = [mockEmployee];


  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create employee', () => {
    it('should create a new employee', async () => {

      jest.spyOn(service, 'create').mockResolvedValue(mockEmployee);

      const result = await controller.create(createEmployeeDto);

      expect(result).toBe(mockEmployee);
      expect(service.create).toHaveBeenCalledWith(createEmployeeDto);
    });
  });

  describe('get all employees and by id', () => {
    it('should return all employees', async () => {

      jest.spyOn(service, 'findAll').mockResolvedValue(employees)

      const result = await controller.findAll();

      expect(result).toBe(employees);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return employees by user ID', async () => {
      const userId = '1';
      jest.spyOn(service, 'findAllByUserId').mockResolvedValue(employees);

      const result = await controller.findAllByUserId(userId);

      expect(result).toBe(employees);
      expect(service.findAllByUserId).toHaveBeenCalledWith(+userId);
    });

    it('should return an employee by ID', async () => {
      const employeeId = '1';
      jest.spyOn(service, 'findOne').mockResolvedValue(mockEmployee);

      const result = await controller.findOne(employeeId);

      expect(result).toBe(mockEmployee);
      expect(service.findOne).toHaveBeenCalledWith(+employeeId);
    });
  });

  describe('update employee', () => {
    it('should update an employee by ID', async () => {
      const id = '1';

      jest.spyOn(service, 'update').mockResolvedValue(mockEmployee);

      const result = await controller.update(id, updatedEmployee);

      expect(result).toBe(mockEmployee);
      expect(service.update).toHaveBeenCalledWith(+id, updatedEmployee);
    });
  });

  describe('delete employee', () => {
    it('should delete an employee by ID', async () => {
      const id = '1';
      jest.spyOn(service, 'remove').mockResolvedValue(null);

      const result = await controller.remove(id);

      expect(result).toBe(null);
      expect(service.remove).toHaveBeenCalledWith(+id);
    });
  });

});
