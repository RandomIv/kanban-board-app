import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CardService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCardDto: CreateCardDto) {
    return this.prisma.card.create({ data: createCardDto });
  }

  update(id: string, updateCardDto: UpdateCardDto) {
    return this.prisma.card.update({ data: updateCardDto, where: { id } });
  }

  remove(id: string) {
    return this.prisma.card.delete({ where: { id } });
  }
}
