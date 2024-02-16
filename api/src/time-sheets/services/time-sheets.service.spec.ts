import { Test, TestingModule } from '@nestjs/testing';
import { TimeSheetsService } from './time-sheets.service';
import { Repository } from 'typeorm';
import { Employee } from '../../database/entities/employee.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TimeSheet } from '../../database/entities/time.sheet.entity';
import { CreateTimeSheetDto } from '../dto/create-time-sheet.dto';
import { PayType } from '../../types/pay.type';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from '../../database/entities/user.entity';
import { MinWages } from '../../database/entities/min.wages.entity';

describe('TimeSheetsService', () => {
  let service: TimeSheetsService;
  let timeSheetsRepository: Repository<TimeSheet>;
  let employeeRepository: Repository<Employee>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimeSheetsService,
        {
          provide: getRepositoryToken(TimeSheet),
          useClass: Repository,
        },
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

    service = module.get<TimeSheetsService>(TimeSheetsService);
    timeSheetsRepository = module.get<Repository<TimeSheet>>(getRepositoryToken(TimeSheet));
    employeeRepository = module.get<Repository<Employee>>(getRepositoryToken(Employee));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

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
  const createTimeSheet: CreateTimeSheetDto = {
    employee_id: 1,
    sheet_check_date: new Date(),
    sheet_hours: 10,
    sheet_pay_rate: 100
  };
  const mockCreatedTimeSheet: TimeSheet = {
    sheet_id: 1,
    employee: mockEmployee,
    sheet_hours: 40,
    sheet_state: "pending",
    sheet_total_payed: 500,
    sheet_check_date: new Date(),
    sheet_pay_rate: 500
  };
  const mockEmployeeHourly = {
    employee_id: 1,
    employee_name: 'John',
    employee_lastname: 'Doe',
    employee_pay_type: PayType.HOURLY,
    employee_pay_rate: 20,
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
      employees: [],
    },
    time_sheets: []
  };
  const mockEmployeeHourlyLowPay = {
    employee_id: 1,
    employee_name: 'John',
    employee_lastname: 'Doe',
    employee_pay_type: PayType.HOURLY,
    employee_pay_rate: 2,
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
      employees: [],
    },
    time_sheets: []
  };
  const mockTimeSheets: TimeSheet[] = [
    {
      sheet_id: 3,
      sheet_state: "pending",
      sheet_hours: 40,
      sheet_total_payed: 480,
      sheet_check_date: new Date(),
      employee: mockEmployee,
      sheet_pay_rate: 480
    },
    {
      sheet_id: 4,
      sheet_state: "pending",
      sheet_hours: 14,
      sheet_total_payed: 210,
      sheet_check_date: new Date(),
      employee: mockEmployee,
      sheet_pay_rate: 39
    }
  ];
  const mockUpdatedSheet = {
    sheet_id: 3,
    sheet_state: "approved",
    sheet_hours: 0,
    sheet_total_payed: 480,
    sheet_check_date: new Date(),
    employee: mockEmployee,
    sheet_pay_rate: 480
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create time sheet', () => {

    it('should create a time sheet successfully', async () => {

      jest.spyOn(employeeRepository, 'findOne').mockResolvedValue(mockEmployee);

      jest.spyOn(timeSheetsRepository, 'create').mockReturnValue(mockCreatedTimeSheet);

      jest.spyOn(timeSheetsRepository, 'save').mockResolvedValue(mockCreatedTimeSheet);

      const createTimeSheet: CreateTimeSheetDto = {
        employee_id: 1,
        sheet_check_date: new Date(),
        sheet_hours: 10,
        sheet_pay_rate: 500
      };

      const result = await service.create(createTimeSheet);

      expect(result).toEqual(mockCreatedTimeSheet);
    });

    it('should throw a NotFoundException exception when employee doesnt exist', async () => {

      jest.spyOn(employeeRepository, 'findOne').mockResolvedValue(null);

      await expect(service.create(createTimeSheet)).rejects.toThrow(NotFoundException);
    });

    it('should throw a BadRequestException when hours are not provided for hourly employee', async () => {
      jest.spyOn(employeeRepository, 'findOne').mockResolvedValue(mockEmployeeHourly);

      const createDto = {
        ...createTimeSheet
      };
      createDto.sheet_hours = 0;

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw a BadRequestException when hourly pay employees are paid less than 100', async () => {
  
      jest.spyOn(employeeRepository, 'findOne').mockResolvedValue(mockEmployeeHourlyLowPay);
    
      jest.spyOn(timeSheetsRepository, 'save').mockResolvedValue(null);

      const createTimeSheet: CreateTimeSheetDto = {
        employee_id: 1,
        sheet_check_date: new Date(),
        sheet_hours: 2,
        sheet_pay_rate: 12,
      };
    
      await expect(service.create(createTimeSheet)).rejects.toThrow(BadRequestException);
    });

  });

  describe('get all time sheets and by ID', () => {
    it('should return all time sheets', async () => {

      jest.spyOn(timeSheetsRepository, 'find').mockResolvedValue(mockTimeSheets);

      const result = await service.findAll();

      expect(result).toEqual(mockTimeSheets);
    });

    it('should return time sheets by user ID', async () => {
      const userId = 1;

      jest.spyOn(timeSheetsRepository, 'find').mockResolvedValue(mockTimeSheets.filter(e => e.employee.user.user_id === userId));

      const result = await service.findAll();

      expect(result).toEqual(mockTimeSheets.filter(e => e.employee.user.user_id === userId));
    });

    it('should return time sheets by employee ID', async () => {
      const employeeId = 1;

      jest.spyOn(timeSheetsRepository, 'find').mockResolvedValue(mockTimeSheets.filter(e => e.employee.employee_id === employeeId));

      const result = await service.findAll();

      expect(result).toEqual(mockTimeSheets.filter(e => e.employee.employee_id === employeeId));
    });

    it('should return time sheet by ID', async () => {
      const timeSheetId = 1;

      jest.spyOn(timeSheetsRepository, 'findOne').mockResolvedValue(mockTimeSheets[0]);

      const result = await service.findOne(timeSheetId);

      expect(result).toEqual(mockTimeSheets[0]);
    });

    it('should throw NotFoundException if no time sheet is found by Id', async () => {
      const timeSheetId = 2;

      jest.spyOn(timeSheetsRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(timeSheetId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update time sheet', () => {
    it('should update time sheet successfully', async () => {
      const timeSheetId = 1;

      jest.spyOn(timeSheetsRepository, 'findOne').mockResolvedValue(mockTimeSheets[0]);

      jest.spyOn(employeeRepository, 'findOne').mockResolvedValue(mockEmployee);

      jest.spyOn(timeSheetsRepository, 'save').mockResolvedValue(mockUpdatedSheet);

      const result = await service.update(timeSheetId, mockUpdatedSheet);

      expect(result).toEqual(mockUpdatedSheet);
    });

    it('should throw NotFoundException if no time sheet is found for the provided ID', async () => {
      const timeSheetId = 2;

      jest.spyOn(timeSheetsRepository, 'findOne').mockResolvedValue(null);

      await expect(service.update(timeSheetId, mockUpdatedSheet)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove time sheet', () => {
    it('should remove time sheet by Id', async () => {
      const timeSheetId = 2;

      jest.spyOn(timeSheetsRepository, 'findOne').mockResolvedValue(mockTimeSheets[0]);

      jest.spyOn(timeSheetsRepository, 'remove').mockResolvedValue(null);

      await service.remove(timeSheetId);

      expect(timeSheetsRepository.remove).toHaveBeenCalledWith(mockTimeSheets[0]);
    });
  });

  describe('update time sheet state', () => {
    it('should update time sheet state by Id', async () => {
      const timeSheetId = 2;
      const newState = "approved";
      const mockTimeSheet = {
        sheet_id: 2,
        sheet_state: "pending",
        sheet_hours: 0,
        sheet_total_payed: 480,
        sheet_check_date: new Date(),
        employee: mockEmployee,
        sheet_pay_rate: 32
      };

      jest.spyOn(timeSheetsRepository, 'findOne').mockResolvedValue(mockTimeSheet);
      jest.spyOn(timeSheetsRepository, 'save').mockResolvedValue({ ...mockTimeSheet, sheet_state: newState });

      await service.updateState(timeSheetId, newState);

      expect(timeSheetsRepository.findOne).toHaveBeenCalledWith({ where: { sheet_id: timeSheetId } });
      expect(timeSheetsRepository.save).toHaveBeenCalledWith({ ...mockTimeSheet, sheet_state: newState });
    });
  });

});
