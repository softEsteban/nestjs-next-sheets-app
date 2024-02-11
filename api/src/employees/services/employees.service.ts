import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { Employee } from 'src/database/entities/employee.entity';
import { User } from 'src/database/entities/user.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const user = await this.userRepository.findOne({ where: { user_id: createEmployeeDto.user_id } });
    if (!user) {
      throw new NotFoundException('User not found with provided id');
    }

    const newEmployee = this.employeeRepository.create({
      employee_name: createEmployeeDto.employee_name,
      employee_lastname: createEmployeeDto.employee_lastname,
      employee_created_at: new Date(),
      employee_pay_type: createEmployeeDto.employee_pay_type,
      employee_pay_rate: createEmployeeDto.employee_pay_rate,
      user: user
    });
    return await this.employeeRepository.save(newEmployee);
  }

  async findAll(): Promise<Employee[]> {
    return await this.employeeRepository.find();
  }

  async findAllByUserId(userId: number): Promise<Employee[]> {
    const employees = await this.employeeRepository.find({ where: { user: { user_id: userId } } });
    if (!employees) {
      throw new NotFoundException('Employees not found for the provided user ID');
    }
    return employees;
  }

  // async findAllByUserId(userId: number): Promise<Employee[]> {
  //   const employees = await this.employeeRepository.find({ where: { user_id: userId } });
  //   if (!employees) {
  //     throw new NotFoundException('Employees not found for the provided user ID');
  //   }
  //   return employees;
  // }

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
    // this.employeeRepository.merge(employee, updateEmployeeDto);
    return await this.employeeRepository.save(employee);
  }

  async remove(id: number): Promise<void> {
    const employee = await this.findOne(id);
    await this.employeeRepository.remove(employee);
  }
}
