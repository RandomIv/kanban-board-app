import { client } from '@/utils/fetch-client';
import { CardTypes, CreateCardDto, UpdateCardDto } from '@/types/card.types';

export const cardService = {
  create: (data: CreateCardDto) => {
    return client<CardTypes>('/cards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: (id: string, data: UpdateCardDto) => {
    return client<CardTypes>(`/cards/${id}`, {
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
