import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Column } from '../../generated/prisma/enums';

export class CreateCardDto {
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
