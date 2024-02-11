import { PartialType } from '@nestjs/swagger';
import { CreateTimeSheetDto } from './create-time-sheet.dto';

export class UpdateTimeSheetDto extends PartialType(CreateTimeSheetDto) {}
