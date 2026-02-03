import { CardTypes } from './card.types';

export type BoardType = {
  id: string;
  name: string;
  cards: CardTypes[];
  createdAt: string;
  updatedAt: string;
};

export type CreateBoardDto = {
  name: string;
};

export type UpdateBoardDto = Partial<CreateBoardDto>;
