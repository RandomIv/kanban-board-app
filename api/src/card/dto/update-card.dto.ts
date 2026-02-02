import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateCardDto } from './create-card.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateCardDto extends PartialType(
  OmitType(CreateCardDto, ['boardId'] as const),
) {
  @IsOptional()
  @IsNumber()
  order?: number;
}
