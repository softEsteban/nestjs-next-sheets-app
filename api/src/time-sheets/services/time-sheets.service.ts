import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTimeSheetDto } from '../dto/create-time-sheet.dto';
import { UpdateTimeSheetDto } from '../dto/update-time-sheet.dto';
import { TimeSheet } from '../../database/entities/time.sheet.entity';
import { Employee } from '../../database/entities/employee.entity';
import { PayType } from '../../types/pay.type';
import { TimeSheetsStates } from 'src/types/time.sheets.states';

@Injectable()
export class TimeSheetsService {
  constructor(
    @InjectRepository(TimeSheet)
    private readonly sheetTimeRepository: Repository<TimeSheet>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>
  ) { }

  async create(createTimeSheetDto: CreateTimeSheetDto): Promise<TimeSheet> {

    const { employee_id, hours, check_date } = createTimeSheetDto;

    // Fetch the corresponding Employee entity based on employee_id
    const employee = await this.employeeRepository.findOne({ where: { employee_id } });
    const { employee_pay_type, employee_pay_rate } = employee;

    if (!employee) {
      throw new BadRequestException(`Employee with id ${employee_id} not found`);
    }

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

    return await this.sheetTimeRepository.save(sheetTime);
  }

  async findAll(): Promise<TimeSheet[]> {
    return await this.sheetTimeRepository.find();
  }

  async findOne(id: number): Promise<TimeSheet> {
    const timeSheet = await this.sheetTimeRepository.findOne({
      where: {
        sheet_id: id
      }
    });
    if (!timeSheet) {
      throw new NotFoundException(`Time sheet with ID ${id} not found`);
    }
    return timeSheet;
  }

  async update(id: number, updateTimeSheetDto: UpdateTimeSheetDto): Promise<TimeSheet> {
    const timeSheet = await this.findOne(id);
    const updatedSheet = Object.assign(timeSheet, updateTimeSheetDto);
    return await this.sheetTimeRepository.save(updatedSheet);
  }

  async remove(id: number): Promise<void> {
    const timeSheet = await this.findOne(id);
    await this.sheetTimeRepository.remove(timeSheet);
  }

  async updateState(id: number, newState: string): Promise<TimeSheet> {
    const timeSheet = await this.findOne(id);
    timeSheet.state = newState;
    return await this.sheetTimeRepository.save(timeSheet);
  }
}
