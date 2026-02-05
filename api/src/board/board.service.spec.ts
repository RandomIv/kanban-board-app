import { Test, TestingModule } from '@nestjs/testing';
import { BoardService } from './board.service';
import { PrismaService } from '../prisma/prisma.service';
import { Board } from '../generated/prisma/client';

describe('BoardService', () => {
  let service: BoardService;

  const mockPrismaService = {
    board: {
      create: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<BoardService>(BoardService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new board', async () => {
      const dto = { name: 'New Project' };
      const expectedBoard = {
        id: '1',
        name: 'New Project',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Board;

      mockPrismaService.board.create.mockResolvedValue(expectedBoard);

      const result = await service.create(dto);

      expect(result).toEqual(expectedBoard);
      expect(mockPrismaService.board.create).toHaveBeenCalledWith({
        data: dto,
      });
    });
  });

  describe('findOne', () => {
    it('should return a board with sorted cards', async () => {
      const expectedBoard = {
        id: '1',
        name: 'My Board',
        cards: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Board;

      mockPrismaService.board.findUniqueOrThrow.mockResolvedValue(
        expectedBoard,
      );

      const result = await service.findOne('1');

      expect(result).toEqual(expectedBoard);
      expect(mockPrismaService.board.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          cards: {
            orderBy: { order: 'asc' },
          },
        },
      });
    });

    it('should propagate error if board not found', async () => {
      const error = new Error('NotFoundError');
      mockPrismaService.board.findUniqueOrThrow.mockRejectedValue(error);

      await expect(service.findOne('999')).rejects.toThrow(error);
    });
  });

  describe('update', () => {
    it('should update a board', async () => {
      const dto = { name: 'Updated Name' };
      const expectedBoard = {
        id: '1',
        name: 'Updated Name',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Board;

      mockPrismaService.board.update.mockResolvedValue(expectedBoard);

      const result = await service.update('1', dto);

      expect(result).toEqual(expectedBoard);
      expect(mockPrismaService.board.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: dto,
      });
    });
  });

  describe('remove', () => {
    it('should delete a board', async () => {
      const expectedBoard = {
        id: '1',
        name: 'Deleted Board',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Board;

      mockPrismaService.board.delete.mockResolvedValue(expectedBoard);

      const result = await service.remove('1');

      expect(result).toEqual(expectedBoard);
      expect(mockPrismaService.board.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
