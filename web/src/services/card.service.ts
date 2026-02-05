import { client } from '@/utils/fetch-client';
import { CardType, CreateCardDto, UpdateCardDto } from '@/types/card.types';

export const cardService = {
  create: (data: CreateCardDto) => {
    return client<CardType>('/cards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: (id: string, data: UpdateCardDto) => {
    return client<CardType>(`/cards/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: (id: string) => {
    return client<void>(`/cards/${id}`, {
      method: 'DELETE',
    });
  },
};
