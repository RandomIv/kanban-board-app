import { client } from '@/utils/fetch-client';
import { BoardType, CreateBoardDto, UpdateBoardDto } from '@/types/board.types';

export const boardService = {
  getById: (id: string) => {
    return client<BoardType>(`/boards/${id}`);
  },

  create: (data: CreateBoardDto) => {
    return client<BoardType>('/boards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: (id: string, data: UpdateBoardDto) => {
    return client<BoardType>(`/boards/${id}`, {
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
