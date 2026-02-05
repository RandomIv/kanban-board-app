import { Test, TestingModule } from '@nestjs/testing';
import { CardService } from './card.service';
import { PrismaService } from '../prisma/prisma.service';
import { Card, Column } from '../generated/prisma/client';

describe('CardService', () => {
  let service: CardService;

  const mockPrismaService = {
    card: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CardService>(CardService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      title: 'New Task',
      boardId: 'board-1',
      column: 'TODO' as Column,
    };

    it('should create first card with order 1000 if column is empty', async () => {
      mockPrismaService.card.findFirst.mockResolvedValue(null);

      const expectedCard = {
        ...createDto,
        id: 'new-id',
        description: null,
        order: 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Card;

      mockPrismaService.card.create.mockResolvedValue(expectedCard);

      const result = await service.create(createDto);

      expect(mockPrismaService.card.findFirst).toHaveBeenCalledWith({
        where: { boardId: createDto.boardId, column: createDto.column },
        orderBy: { order: 'desc' },
      });

      expect(mockPrismaService.card.create).toHaveBeenCalledWith({
        data: { ...createDto, order: 1000 },
      });

      expect(result).toEqual(expectedCard);
    });

    it('should create next card with incremented order if cards exist', async () => {
      const lastCard = {
        id: 'prev-id',
        title: 'Old Task',
        description: null,
        boardId: 'board-1',
        column: 'TODO',
        order: 5000,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Card;

      mockPrismaService.card.findFirst.mockResolvedValue(lastCard);

      const expectedOrder = 6000;
      const newCard = {
        ...createDto,
        id: 'new-id',
        description: null,
        order: expectedOrder,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Card;

      mockPrismaService.card.create.mockResolvedValue(newCard);

      const result = await service.create(createDto);

      expect(mockPrismaService.card.create).toHaveBeenCalledWith({
        data: { ...createDto, order: expectedOrder },
      });

      expect(result).toEqual(newCard);
    });
  });

  describe('update', () => {
    it('should update a card', async () => {
      const updateDto = { title: 'Updated Title' };

      const updatedCard = {
        id: '1',
        title: 'Updated Title',
        description: 'Desc',
        order: 1000,
        boardId: 'b-1',
        column: 'TODO',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Card;

      mockPrismaService.card.update.mockResolvedValue(updatedCard);

      const result = await service.update('1', updateDto);

      expect(mockPrismaService.card.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateDto,
      });
      expect(result).toEqual(updatedCard);
    });
  });

  describe('remove', () => {
    it('should delete a card', async () => {
      const deletedCard = {
        id: '1',
        title: 'Deleted',
        order: 1000,
      } as Card;

      mockPrismaService.card.delete.mockResolvedValue(deletedCard);

      const result = await service.remove('1');

      expect(mockPrismaService.card.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(deletedCard);
    });
  });
});
