import { Test, TestingModule } from '@nestjs/testing';
import { TimeSheetsController } from './time-sheets.controller';
import { TimeSheetsService } from '../services/time-sheets.service';
import { Employee } from '../../database/entities/employee.entity';
import { CreateTimeSheetDto } from '../dto/create-time-sheet.dto';
import { PayType } from '../../types/pay.type';
import { TimeSheet } from '../../database/entities/time.sheet.entity';

describe('TimeSheetsController', () => {
  let controller: TimeSheetsController;
  let service: TimeSheetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeSheetsController],
      providers: [
        TimeSheetsService,
        {
          provide: TimeSheetsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            findAllByUserId: jest.fn(),
            findAllByEmployeeId: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            updateState: jest.fn()
          }
        }],
    }).compile();

    controller = module.get<TimeSheetsController>(TimeSheetsController);
    service = module.get<TimeSheetsService>(TimeSheetsService);
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
  const mockTimeSheet = {
    sheet_id: 1,
    sheet_state: "pending",
    sheet_hours: 4,
    sheet_check_date: new Date(),
    sheet_pay_rate: 45,
    sheet_total_payed: 180,
    employee: mockEmployee,
  };
  const createTimeSheetDto: CreateTimeSheetDto = {
    sheet_check_date: new Date(),
    sheet_hours: 4,
    sheet_pay_rate: 45,
    employee_id: 2
  };
  const timesheets: TimeSheet[] = [mockTimeSheet];
  const updatedTimeSheet: TimeSheet = {
    sheet_id: 1,
    sheet_state: "pending",
    sheet_hours: 6,
    sheet_check_date: new Date(),
    sheet_pay_rate: 45,
    sheet_total_payed: 270,
    employee: mockEmployee,
  };

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create timesheet', () => {
    it('should create a new employee', async () => {

      jest.spyOn(service, 'create').mockResolvedValue(mockTimeSheet);

      const result = await controller.create(createTimeSheetDto);

      expect(result).toBe(mockTimeSheet);
      expect(service.create).toHaveBeenCalledWith(createTimeSheetDto);
    });
  });

  describe('get all timesheets and by id', () => {
    it('should return all timesheets', async () => {

      jest.spyOn(service, 'findAll').mockResolvedValue(timesheets)

      const result = await controller.findAll();

      expect(result).toBe(timesheets);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return all timesheets by user ID', async () => {
      const userId = 2;

      jest.spyOn(service, 'findAllByUserId').mockResolvedValue(timesheets);

      const result = await controller.findAllByUser(userId);

      expect(result).toBe(timesheets);
      expect(service.findAllByUserId).toHaveBeenCalled();
    });

    it('should return all timesheets by employee ID', async () => {
      const userId = 2;

      jest.spyOn(service, 'findAllByEmployeeId').mockResolvedValue(timesheets);

      const result = await controller.findAllByEmployeeId(userId);

      expect(result).toBe(timesheets);
      expect(service.findAllByEmployeeId).toHaveBeenCalled();
    });

    it('should return a timesheet by ID', async () => {
      const timeSheeetId = '1';

      jest.spyOn(service, 'findOne').mockResolvedValue(mockTimeSheet);

      const result = await controller.findOne(timeSheeetId);

      expect(result).toBe(mockTimeSheet);
      expect(service.findOne).toHaveBeenCalledWith(+timeSheeetId);
    });

  });

  describe('update timesheets', () => {
    it('should update a timesheet by ID', async () => {

      const timeSheetId = '1';

      jest.spyOn(service, 'update').mockResolvedValue(mockTimeSheet);

      const result = await controller.update(timeSheetId, updatedTimeSheet);

      expect(result).toBe(mockTimeSheet);

      expect(service.update).toHaveBeenCalledWith(+timeSheetId, updatedTimeSheet);
    });

    it('should update the state of a timesheet by ID', async () => {
      const timeSheetId = '1';
      const newState = 'approved';

      jest.spyOn(service, 'updateState').mockResolvedValue(mockTimeSheet);

      const result = await controller.updateState(timeSheetId, newState);

      expect(result).toBe(mockTimeSheet);

      expect(service.updateState).toHaveBeenCalledWith(+timeSheetId, newState);
    });
  });

  describe('delete timesheets', () => {
    it('should delete a timesheet by ID', async () => {
      const id = '1';
      jest.spyOn(service, 'remove').mockResolvedValue(null);

      const result = await controller.remove(id);

      expect(result).toBe(null);
      expect(service.remove).toHaveBeenCalledWith(+id);
    });
  });

});
