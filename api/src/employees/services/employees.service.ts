import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { Employee } from '../../database/entities/employee.entity';
import { User } from '../../database/entities/user.entity';
import { PayType } from '../../types/pay.type';
import { MinWages } from '../../database/entities/min.wages.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(MinWages)
    private readonly minWagesRepository: Repository<MinWages>
  ) { }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    // Validate existing client
    const user = await this.userRepository.findOne({ where: { user_id: createEmployeeDto.user_id } });
    if (!user) {
      throw new NotFoundException('User not found with provided id');
    }

    // Retrieve minimum wage values from the repository
    const minWages = await this.minWagesRepository.find();

    // Determine minimum wage values for salary and hourly pay types
    const salaryMinWage = minWages.find(wage => wage.wage_name === 'Salary')?.wage_value;
    const hourlyMinWage = minWages.find(wage => wage.wage_name === 'Hour')?.wage_value;

    // Validate minimum wages 
    if (createEmployeeDto.employee_pay_type === PayType.SALARY && createEmployeeDto.employee_pay_rate < salaryMinWage) {
      throw new BadRequestException(`Salary type employees pay rate should be equal or greater than ${salaryMinWage} per check`);
    }
    if (createEmployeeDto.employee_pay_type === PayType.HOURLY && createEmployeeDto.employee_pay_rate < hourlyMinWage) {
      throw new BadRequestException(`Hourly type employees pay rate should be equal or greater than ${hourlyMinWage} per hour`);
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
  
  async update(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: {
        employee_id: id
      }
    });

    if(!employee){
      throw new NotFoundException(`Employee with id ${id} not found`);
    }
    
    // Update the properties of the existing employee with the values from updateEmployeeDto
    employee.employee_name = updateEmployeeDto.employee_name;
    employee.employee_lastname = updateEmployeeDto.employee_lastname;
    employee.employee_pay_type = updateEmployeeDto.employee_pay_type;
    employee.employee_pay_rate = updateEmployeeDto.employee_pay_rate;
  
    // Save the updated employee to the database
    return await this.employeeRepository.save(employee);
  }

  async remove(id: number): Promise<void> {
    const employee = await this.employeeRepository.findOne({
      where: {
        employee_id: id
      }
    });
    if(!employee){
      throw new NotFoundException(`Employee with id ${id} not found`);
    }
    await this.employeeRepository.remove(employee);
  }
}
