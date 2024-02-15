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
import { MinWages } from 'src/database/entities/min.wages.entity';

@Injectable()
export class TimeSheetsService {
  constructor(
    @InjectRepository(TimeSheet)
    private readonly timeSheetsRepository: Repository<TimeSheet>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(MinWages)
    private readonly minWagesRepository: Repository<MinWages>
  ) { }

  async create(createTimeSheetDto: CreateTimeSheetDto): Promise<TimeSheet> {

    const { employee_id, sheet_hours, sheet_check_date, sheet_pay_rate } = createTimeSheetDto;

    // Fetch the corresponding Employee entity based on employee_id
    const employee = await this.employeeRepository.findOne({ where: { employee_id } });

    if (!employee) {
      throw new NotFoundException(`Employee with id ${employee_id} not found`);
    }

    const { employee_pay_type } = employee;

    // Retrieve minimum wage values from the repository
    const minWages = await this.minWagesRepository.find();

    // Determine minimum wage values for salary and hourly pay types
    const salaryMinWage = minWages.find(wage => wage.wage_name === 'Salary')?.wage_value;
    const hourlyMinWage = minWages.find(wage => wage.wage_name === 'Hour')?.wage_value;

    if (employee_pay_type === PayType.SALARY && sheet_pay_rate < salaryMinWage) {
      throw new BadRequestException(`Salary type employees pay rate should be equal or greater than ${salaryMinWage} per check`);
    }

    if (employee_pay_type === PayType.HOURLY && sheet_pay_rate < hourlyMinWage) {
      throw new BadRequestException(`Hourly type employees pay rate should be equal or greater than ${hourlyMinWage} per hour`);
    }

    // Validate employee pay type and rate
    if (employee_pay_type === PayType.HOURLY && sheet_hours === 0) {
      throw new BadRequestException('Hours field cannot be empty for hourly pay employees');
    }
    if (employee_pay_type === PayType.HOURLY && (sheet_pay_rate * sheet_hours) < 100) {
      throw new BadRequestException('Hourly pay employees cannot be payed lesser than 100');
    }

    const sheetTime = new TimeSheet();

    if (employee_pay_type === PayType.HOURLY) {
      sheetTime.employee = employee;
      sheetTime.sheet_state = TimeSheetsStates.PENDING;
      sheetTime.sheet_total_payed = sheet_pay_rate * sheet_hours;
      sheetTime.sheet_check_date = sheet_check_date;
      sheetTime.sheet_pay_rate = sheet_pay_rate;
      sheetTime.sheet_hours = sheet_hours;
    }

    if (employee_pay_type === PayType.SALARY) {
      sheetTime.employee = employee;
      sheetTime.sheet_state = TimeSheetsStates.PENDING;
      sheetTime.sheet_total_payed = sheet_pay_rate;
      sheetTime.sheet_check_date = sheet_check_date;
      sheetTime.sheet_pay_rate = sheet_pay_rate;
      sheetTime.sheet_hours = 40;
    }

    return await this.timeSheetsRepository.save(sheetTime);
  }

  async findAll(): Promise<TimeSheet[]> {
    return await this.timeSheetsRepository.find({ relations: ['employee'] });
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
    const { sheet_hours, sheet_check_date, sheet_pay_rate } = updateTimeSheetDto;

    const timeSheet = await this.findOne(id);

    if (!timeSheet) {
      throw new NotFoundException(`Time sheet with ID ${id} not found`);
    }

    const employee = await this.employeeRepository.findOne({ where: { employee_id: timeSheet.employee.employee_id } });
    const { employee_pay_type } = employee;

    // Retrieve minimum wage values from the repository
    const minWages = await this.minWagesRepository.find();

    // Determine minimum wage values for salary and hourly pay types
    const salaryMinWage = minWages.find(wage => wage.wage_name === 'Salary')?.wage_value;
    const hourlyMinWage = minWages.find(wage => wage.wage_name === 'Hour')?.wage_value;

    if (employee_pay_type === PayType.SALARY && sheet_pay_rate < salaryMinWage) {
      throw new BadRequestException(`Salary type employees pay rate should be equal or greater than ${salaryMinWage} per check`);
    }

    if (employee_pay_type === PayType.HOURLY && sheet_pay_rate < hourlyMinWage) {
      throw new BadRequestException(`Hourly type employees pay rate should be equal or greater than ${hourlyMinWage} per hour`);
    }

    if (employee_pay_type === PayType.HOURLY && updateTimeSheetDto.sheet_hours != timeSheet.sheet_hours) {
      timeSheet.sheet_hours = sheet_hours;
      timeSheet.sheet_total_payed = sheet_pay_rate * sheet_hours;
    }

    if (employee_pay_type === PayType.SALARY) {
      timeSheet.sheet_total_payed = sheet_pay_rate;
    }

    timeSheet.sheet_check_date = sheet_check_date;

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

    timeSheet.sheet_state = newState;
    return await this.timeSheetsRepository.save(timeSheet);
  }
}
