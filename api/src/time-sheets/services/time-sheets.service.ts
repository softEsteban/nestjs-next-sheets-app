import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTimeSheetDto } from '../dto/create-time-sheet.dto';
import { UpdateTimeSheetDto } from '../dto/update-time-sheet.dto';
import { TimeSheet } from '../../database/entities/time.sheet.entity';
import { Employee } from '../../database/entities/employee.entity';

@Injectable()
export class TimeSheetsService {
  constructor(
    @InjectRepository(TimeSheet)
    private readonly sheetTimeRepository: Repository<TimeSheet>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>
  ) { }

  async create(createTimeSheetDto: CreateTimeSheetDto): Promise<TimeSheet> {
    const { employee_id, state, hourly_rate, hours } = createTimeSheetDto;

    if (hourly_rate < 12.0) {
      throw new BadRequestException('Hourly rate must be greater than or equal to 12.00');
    }

    if (!hours) {
      throw new BadRequestException('Hours field cannot be empty');
    }

    // Fetch the corresponding Employee entity based on employee_id
    const employee = await this.employeeRepository.findOne({ where: { employee_id } });
    if (!employee) {
      throw new BadRequestException(`Employee with id ${employee_id} not found`);
    }

    const sheetTime = new TimeSheet();
    sheetTime.employee_id = employee; // Assign Employee entity to employee_id property
    sheetTime.state = state;
    sheetTime.hourly_rate = hourly_rate;
    sheetTime.hours = hours;

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
