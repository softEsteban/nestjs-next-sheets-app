import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateTimeSheetDto } from '../dto/create-time-sheet.dto';
import { UpdateTimeSheetDto } from '../dto/update-time-sheet.dto';
import { TimeSheet } from '../../database/entities/time.sheet.entity';
import { Employee } from '../../database/entities/employee.entity';
import { PayType } from '../../types/pay.type';
import { TimeSheetsStates } from '../../types/time.sheets.states';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class TimeSheetsService {
  constructor(
    @InjectRepository(TimeSheet)
    private readonly timeSheetsRepository: Repository<TimeSheet>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async create(createTimeSheetDto: CreateTimeSheetDto): Promise<TimeSheet> {

    const { employee_id, hours, check_date } = createTimeSheetDto;

    // Fetch the corresponding Employee entity based on employee_id
    const employee = await this.employeeRepository.findOne({ where: { employee_id } });

    if (!employee) {
      throw new NotFoundException(`Employee with id ${employee_id} not found`);
    }

    const { employee_pay_type, employee_pay_rate } = employee;

    // Validate employee pay type and rate
    if (employee_pay_type === PayType.HOURLY && hours === 0) {
      throw new BadRequestException('Hours field cannot be empty for hourly pay employees');
    }
    if (employee_pay_type === PayType.HOURLY && (employee_pay_rate * hours) < 100) {
      throw new BadRequestException('Hourly pay employees cannot be payed lesser than 100');
    }

    const sheetTime = new TimeSheet();

    sheetTime.employee = employee;
    sheetTime.state = TimeSheetsStates.PENDING;
    sheetTime.hours = employee_pay_type === PayType.HOURLY ? hours : 40;
    sheetTime.total_payed = employee_pay_type === PayType.HOURLY ? (employee_pay_rate * hours) : employee_pay_rate;
    sheetTime.check_date = check_date;

    return await this.timeSheetsRepository.save(sheetTime);
  }

  async findAll(): Promise<TimeSheet[]> {
    return await this.timeSheetsRepository.find();
  }

  async findAllByUser(userId: number): Promise<TimeSheet[]> {
    const user = await this.userRepository.findOne({
      where: {
        user_id: userId
      },
      relations: ['employees']
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const employeeIds = user.employees.map(employee => employee.employee_id);
    return await this.timeSheetsRepository.find({ where: { employee: In(employeeIds) }, relations: ['employee'] });
  }

  async findAllByEmployee(employeeId: number): Promise<TimeSheet[]> {
    const employee = await this.employeeRepository.findOne({
      where: {
        employee_id: employeeId
      }
    });

    if (!employee) {
      throw new NotFoundException(`EMployee with id ${employeeId} not found`);
    }
    return await this.timeSheetsRepository.find({ where: { employee: employee }, relations: ['employee'] });
  }

  async findOne(id: number): Promise<TimeSheet> {
    const timeSheet = await this.timeSheetsRepository.findOne({
      where: {
        sheet_id: id
      },
      relations: ['employee']
    });
    if (!timeSheet) {
      throw new NotFoundException(`Time sheet with ID ${id} not found`);
    }
    return timeSheet;
  }

  async update(id: number, updateTimeSheetDto: UpdateTimeSheetDto): Promise<TimeSheet> {
    const timeSheet = await this.findOne(id);
    
    if (!timeSheet) {
      throw new NotFoundException(`Time sheet with ID ${id} not found`);
    }

    const employee = await this.employeeRepository.findOne({ where: { employee_id: timeSheet.employee.employee_id } });

    if (employee.employee_pay_type === PayType.HOURLY && updateTimeSheetDto.hours != timeSheet.hours) {
      timeSheet.hours = updateTimeSheetDto.hours;
      timeSheet.total_payed = employee.employee_pay_rate * updateTimeSheetDto.hours;
    }

    timeSheet.check_date = updateTimeSheetDto.check_date;

    return await this.timeSheetsRepository.save(timeSheet);
  }

  async remove(id: number): Promise<void> {
    const timeSheet = await this.findOne(id);
    
    if (!timeSheet) {
      throw new NotFoundException(`Time sheet with ID ${id} not found`);
    }

    await this.timeSheetsRepository.remove(timeSheet);
  }

  async updateState(id: number, newState: string): Promise<TimeSheet> {
    const timeSheet = await this.timeSheetsRepository.findOne({
      where: {
        sheet_id: id
      }
    });

    if (!timeSheet) {
      throw new NotFoundException(`Time sheet with ID ${id} not found`);
    }
    
    timeSheet.state = newState;
    return await this.timeSheetsRepository.save(timeSheet);
  }
}
