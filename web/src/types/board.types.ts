import { CardType } from './card.types';

export type BoardType = {
  id: string;
  name: string;
  cards: CardType[];
  createdAt: string;
  updatedAt: string;
};

export type CreateBoardDto = {
  name: string;
};

export type UpdateBoardDto = Partial<CreateBoardDto>;
