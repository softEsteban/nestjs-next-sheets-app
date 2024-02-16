import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards } from '@nestjs/common';
import { TimeSheetsService } from '../services/time-sheets.service';
import { CreateTimeSheetDto } from '../dto/create-time-sheet.dto';
import { UpdateTimeSheetDto } from '../dto/update-time-sheet.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TimeSheet } from 'src/database/entities/time.sheet.entity';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Time Sheets')
@Controller('time-sheets')
export class TimeSheetsController {
  constructor(private readonly timeSheetsService: TimeSheetsService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new time sheet' })
  create(@Body() createTimeSheetDto: CreateTimeSheetDto) {
    return this.timeSheetsService.create(createTimeSheetDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all time sheets' })
  findAll() {
    return this.timeSheetsService.findAll();
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all time sheets for a user' })
  async findAllByUser(@Param('userId') userId: number): Promise<TimeSheet[]> {
    return await this.timeSheetsService.findAllByUserId(userId); 
  }

  @Get('employee/:employeeId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all time sheets for a user' })
  async findAllByEmployeeId(@Param('employeeId') employeeId: number): Promise<TimeSheet[]> {
    return await this.timeSheetsService.findAllByEmployeeId(employeeId); 
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get a time sheet by ID' })
  findOne(@Param('id') id: string) {
    return this.timeSheetsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update a time sheet by ID' })
  update(@Param('id') id: string, @Body() updateTimeSheetDto: UpdateTimeSheetDto) {
    return this.timeSheetsService.update(+id, updateTimeSheetDto);
  }

  @Get(':id/:state')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update the state of a time sheet by ID' })
  updateState(@Param('id') id: string, @Param('state') newState: string) {
    return this.timeSheetsService.updateState(+id, newState);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete a time sheet by ID' })
  remove(@Param('id') id: string) {
    return this.timeSheetsService.remove(+id);
  }
}
