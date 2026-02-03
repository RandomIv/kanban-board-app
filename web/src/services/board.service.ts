import { client } from '@/utils/fetch-client';
import { Board, CreateBoardDto, UpdateBoardDto } from '@/types/board.types';

export const boardService = {
  getById: (id: string) => {
    return client<Board>(`/boards/${id}`);
  },

  create: (data: CreateBoardDto) => {
    return client<Board>('/boards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: (id: string, data: UpdateBoardDto) => {
    return client<Board>(`/boards/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: (id: string) => {
    return client<void>(`/boards/${id}`, {
      method: 'DELETE',
    });
  },
};
