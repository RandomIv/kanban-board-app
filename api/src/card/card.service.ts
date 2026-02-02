import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CardService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCardDto: CreateCardDto) {
    const lastCard = await this.prisma.card.findFirst({
      where: {
        boardId: createCardDto.boardId,
        column: createCardDto.column,
      },
      orderBy: { order: 'desc' },
    });
    const lastCardOrder = lastCard ? lastCard.order + 1000 : 1000;
    return this.prisma.card.create({
      data: { ...createCardDto, order: lastCardOrder },
    });
  }

  update(id: string, updateCardDto: UpdateCardDto) {
    return this.prisma.card.update({ data: updateCardDto, where: { id } });
  }

  remove(id: string) {
    return this.prisma.card.delete({ where: { id } });
  }
}
