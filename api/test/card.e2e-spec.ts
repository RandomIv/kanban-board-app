import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Server } from 'http';
import { Card, Column } from '../src/generated/prisma/client';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { setupApp } from '../src/setup-app';

describe('CardController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let httpServer: Server;

  let boardId: string;
  let cardId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    setupApp(app);

    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    httpServer = app.getHttpServer() as Server;

    const board = await prisma.board.create({
      data: { name: 'Card E2E Parent Board' },
    });

    boardId = board.id;
  });

  afterAll(async () => {
    if (boardId) {
      await prisma.board.deleteMany({ where: { id: boardId } });
    }
    await app.close();
    await prisma.$disconnect();
  });

  it('/cards (POST)', async () => {
    const createDto = {
      title: 'E2E Card',
      column: 'TODO' as Column,
      boardId,
    };

    const response = await request(httpServer)
      .post('/cards')
      .send(createDto)
      .expect(201);

    const body = response.body as Card;

    expect(body.id).toBeDefined();
    expect(body.title).toBe(createDto.title);
    expect(body.boardId).toBe(boardId);
    expect(body.order).toBeDefined();

    cardId = body.id;
  });

  it('/cards/:id (PATCH)', async () => {
    const response = await request(httpServer)
      .patch(`/cards/${cardId}`)
      .send({ title: 'Updated Card Title' })
      .expect(200);

    const body = response.body as Card;
    expect(body.title).toBe('Updated Card Title');
  });

  it('/cards/:id (DELETE)', async () => {
    await request(httpServer).delete(`/cards/${cardId}`).expect(200);

    const check = await prisma.card.findUnique({ where: { id: cardId } });
    expect(check).toBeNull();
  });

  it('/cards (POST) - validation fail (missing boardId)', async () => {
    await request(httpServer)
      .post('/cards')
      .send({ title: 'Orphan Card', column: 'TODO' })
      .expect(400);
  });

  it('/cards (POST) - validation fail (invalid column)', async () => {
    await request(httpServer)
      .post('/cards')
      .send({
        title: 'Bad Column Card',
        boardId,
        column: 'INVALID_COLUMN',
      })
      .expect(400);
  });

  it('/cards/:id (PATCH) - not found', async () => {
    await request(httpServer)
      .patch('/cards/00000000-0000-0000-0000-000000000000')
      .send({ title: 'Ghost' })
      .expect(404);
  });
});
