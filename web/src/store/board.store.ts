import { create } from 'zustand';
import { CardType } from '@/types/card.types';

interface BoardStore {
  cards: CardType[];
  setCards: (cards: CardType[]) => void;
  updateCard: (card: CardType) => void;
}

export const useBoardStore = create<BoardStore>((set) => ({
  cards: [],
  setCards: (cards) => set({ cards }),
  updateCard: (updatedCard) =>
    set((state) => ({
      cards: state.cards.map((c) =>
        c.id === updatedCard.id ? updatedCard : c,
      ),
    })),
}));
