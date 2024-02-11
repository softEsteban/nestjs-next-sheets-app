import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TimeSheetsService } from '../services/time-sheets.service';
import { CreateTimeSheetDto } from '../dto/create-time-sheet.dto';
import { UpdateTimeSheetDto } from '../dto/update-time-sheet.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Time Sheets')
@Controller('time-sheets')
export class TimeSheetsController {
  constructor(private readonly timeSheetsService: TimeSheetsService) {}

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

  @Patch(':id/state')
  @ApiOperation({ summary: 'Update the state of a time sheet by ID' })
  updateState(@Param('id') id: string, @Body('state') newState: string) {
    return this.timeSheetsService.updateState(+id, newState);
  }
  
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a time sheet by ID' })
  remove(@Param('id') id: string) {
    return this.timeSheetsService.remove(+id);
  }
}
