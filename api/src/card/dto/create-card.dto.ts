import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Column } from '../../generated/prisma/enums';

export class CreateCardDto {
  @IsNotEmpty()
  @IsNumber()
  order: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  boardId: string;

  @IsNotEmpty()
  @IsEnum(Column)
  column: Column;
}
