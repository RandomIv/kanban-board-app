import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Server } from 'http';
import { Board, Card } from '../src/generated/prisma/client';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { setupApp } from '../src/setup-app';

type BoardWithCards = Board & { cards: Card[] };

describe('BoardController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let httpServer: Server;
  let boardId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    setupApp(app);

    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    httpServer = app.getHttpServer() as Server;
  });

  afterAll(async () => {
    if (boardId) {
      await prisma.board.deleteMany({ where: { id: boardId } });
    }
    await app.close();
    await prisma.$disconnect();
  });

  it('/boards (POST)', async () => {
    const response = await request(httpServer)
      .post('/boards')
      .send({ name: 'Clean Type Board' })
      .expect(201);

    const body = response.body as Board;

    expect(body.id).toBeDefined();
    expect(body.name).toBe('Clean Type Board');

    boardId = body.id;
  });

  it('/boards/:id (GET)', async () => {
    await prisma.card.createMany({
      data: [
        { title: 'Card 2', column: 'TODO', order: 200, boardId },
        { title: 'Card 1', column: 'TODO', order: 100, boardId },
      ],
    });

    const response = await request(httpServer)
      .get(`/boards/${boardId}`)
      .expect(200);

    const body = response.body as BoardWithCards;

    expect(body.id).toBe(boardId);
    expect(body.name).toBe('Clean Type Board');
    expect(body.cards).toHaveLength(2);
    expect(body.cards[0].order).toBeLessThan(body.cards[1].order);
  });

  it('/boards/:id (PATCH)', async () => {
    const response = await request(httpServer)
      .patch(`/boards/${boardId}`)
      .send({ name: 'Updated Clean Name' })
      .expect(200);

    const body = response.body as Board;
    expect(body.name).toBe('Updated Clean Name');
  });

  it('/boards/:id (DELETE)', async () => {
    await request(httpServer).delete(`/boards/${boardId}`).expect(200);

    const check = await prisma.board.findUnique({ where: { id: boardId } });
    expect(check).toBeNull();
  });

  it('/boards/:id (GET) - verify delete', async () => {
    await request(httpServer).get(`/boards/${boardId}`).expect(404);
  });

  it('/boards (POST) - validation fail', async () => {
    await request(httpServer).post('/boards').send({ name: '' }).expect(400);
  });

  it('/boards/:id (GET) - not found uuid', async () => {
    await request(httpServer)
      .get('/boards/00000000-0000-0000-0000-000000000000')
      .expect(404);
  });
});
