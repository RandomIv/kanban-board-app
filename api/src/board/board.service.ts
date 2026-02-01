import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Board } from '../generated/prisma/client';

@Injectable()
export class BoardService {
  constructor(private readonly prisma: PrismaService) {}
  findOne(id: string): Promise<Board> {
    return this.prisma.board.findUniqueOrThrow({
      where: { id },
      include: {
        cards: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }
  create(createBoardDto: CreateBoardDto): Promise<Board> {
    return this.prisma.board.create({ data: createBoardDto });
  }
  update(id: string, updateBoardDto: UpdateBoardDto): Promise<Board> {
    return this.prisma.board.update({
      where: { id },
      data: updateBoardDto,
    });
  }
  remove(id: string): Promise<Board> {
    return this.prisma.board.delete({ where: { id } });
  }
}
