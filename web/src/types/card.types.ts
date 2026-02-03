export type Column = 'TODO' | 'IN_PROGRESS' | 'DONE';

export type CardTypes = {
  id: string;
  title: string;
  description?: string;
  order: number;
  column: Column;
  boardId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateCardDto = {
  title: string;
  description?: string;
  boardId: string;
  column: Column;
};

export type UpdateCardDto = Partial<Omit<CreateCardDto, 'boardId'>> & {
  order?: number;
};
