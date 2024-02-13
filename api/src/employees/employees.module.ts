import { Module } from '@nestjs/common';
import { EmployeesService } from './services/employees.service';
import { EmployeesController } from './controllers/employees.controller';
import { Employee } from '../database/entities/employee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { MinWages } from '../database/entities/min.wages.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Employee, User, MinWages])],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
