import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { Employee } from 'src/database/entities/employee.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const newEmployee = this.employeeRepository.create(createEmployeeDto);
    return await this.employeeRepository.save(newEmployee);
  }

  async findAll(): Promise<Employee[]> {
    return await this.employeeRepository.find();
  }

  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      select: {
        employee_name: true,
        employee_lastname: true,
        employee_created_at: true
      },
      where: {
        employee_id: id
      }
    });
    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }
    return employee;
  }

  async update(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    const employee = await this.findOne(id);
    this.employeeRepository.merge(employee, updateEmployeeDto);
    return await this.employeeRepository.save(employee);
  }

  async remove(id: number): Promise<void> {
    const employee = await this.findOne(id);
    await this.employeeRepository.remove(employee);
  }
}
