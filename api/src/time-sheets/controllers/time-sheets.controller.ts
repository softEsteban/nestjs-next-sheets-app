import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { TimeSheetsService } from '../services/time-sheets.service';
import { CreateTimeSheetDto } from '../dto/create-time-sheet.dto';
import { UpdateTimeSheetDto } from '../dto/update-time-sheet.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TimeSheet } from 'src/database/entities/time.sheet.entity';

@ApiTags('Time Sheets')
@Controller('time-sheets')
export class TimeSheetsController {
  constructor(private readonly timeSheetsService: TimeSheetsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new time sheet' })
  create(@Body() createTimeSheetDto: CreateTimeSheetDto) {
    return this.timeSheetsService.create(createTimeSheetDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all time sheets' })
  findAll() {
    return this.timeSheetsService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all time sheets for a user' })
  async findAllByUser(@Param('userId') userId: number): Promise<TimeSheet[]> {
    return await this.timeSheetsService.findAllByUser(userId); 
  }

  @Get('employee/:employeeId')
  @ApiOperation({ summary: 'Get all time sheets for a user' })
  async findAllByEmployee(@Param('employeeId') employeeId: number): Promise<TimeSheet[]> {
    return await this.timeSheetsService.findAllByEmployee(employeeId); 
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a time sheet by ID' })
  findOne(@Param('id') id: string) {
    return this.timeSheetsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a time sheet by ID' })
  update(@Param('id') id: string, @Body() updateTimeSheetDto: UpdateTimeSheetDto) {
    return this.timeSheetsService.update(+id, updateTimeSheetDto);
  }

  @Post(':id/:state')
  @ApiOperation({ summary: 'Update the state of a time sheet by ID' })
  updateState(@Param('id') id: string, @Param('state') newState: string) {
    return this.timeSheetsService.updateState(+id, newState);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a time sheet by ID' })
  remove(@Param('id') id: string) {
    return this.timeSheetsService.remove(+id);
  }
}
