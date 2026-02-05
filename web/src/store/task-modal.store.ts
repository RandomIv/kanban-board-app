import { create } from 'zustand';
import { CardType, Column } from '@/types/card.types';

interface TaskModalState {
  isOpen: boolean;
  mode: 'CREATE' | 'EDIT';
  activeCard: CardType | null;
  targetColumn: Column | null;

  onOpenCreate: (column: Column) => void;
  onOpenEdit: (card: CardType) => void;
  onClose: () => void;
}

export const useTaskModalStore = create<TaskModalState>((set) => ({
  isOpen: false,
  mode: 'CREATE',
  activeCard: null,
  targetColumn: null,

  onOpenCreate: (column) =>
    set({
      isOpen: true,
      mode: 'CREATE',
      targetColumn: column,
      activeCard: null,
    }),

  onOpenEdit: (card) =>
    set({
      isOpen: true,
      mode: 'EDIT',
      activeCard: card,
      targetColumn: null,
    }),

  onClose: () =>
    set({
      isOpen: false,
      mode: 'CREATE',
      activeCard: null,
      targetColumn: null,
    }),
}));
