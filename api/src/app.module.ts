import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeSheetsModule } from './time-sheets/time-sheets.module';
import { dataSourcerOptions } from './database/data.source';
import { UsersModule } from './users/users.module';
import { EmployeesModule } from './employees/employees.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    EmployeesModule,
    TimeSheetsModule,
    TypeOrmModule.forRoot(dataSourcerOptions),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
