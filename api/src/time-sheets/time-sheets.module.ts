import { Module } from '@nestjs/common';
import { TimeSheetsService } from './services/time-sheets.service';
import { TimeSheetsController } from './controllers/time-sheets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '../database/entities/employee.entity';
import { TimeSheet } from '../database/entities/time.sheet.entity';
import { User } from '../database/entities/user.entity';
import { MinWages } from '../database/entities/min.wages.entity';

@Module({
  imports:[TypeOrmModule.forFeature([TimeSheet, Employee, User, MinWages])],
  controllers: [TimeSheetsController],
  providers: [TimeSheetsService],
})
export class TimeSheetsModule {}
