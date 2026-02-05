import { DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Column } from '@/types/card.types';
import { useUpdateCard } from './use-card';
import { useBoardStore } from '@/store/board.store';

export function useDragAndDrop() {
  const { cards, setCards } = useBoardStore();
  const updateCardMutation = useUpdateCard();

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    const isActiveCard = active.data.current?.type === 'card';
    const isOverCard = over.data.current?.type === 'card';
    const isOverColumn = over.data.current?.type === 'column';

    if (!isActiveCard) return;

    const activeIndex = cards.findIndex((c) => c.id === active.id);
    const overIndex = cards.findIndex((c) => c.id === over.id);

    if (activeIndex === -1) return;

    if (isOverCard) {
      if (overIndex === -1) return;
      const activeCard = cards[activeIndex];
      const overCard = cards[overIndex];

      if (activeCard.column !== overCard.column) {
        const isBelowOverItem =
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;

        const modifier = isBelowOverItem ? 1 : 0;
        const newIndex =
          overIndex >= 0 ? overIndex + modifier : cards.length + 1;

        setCards(
          arrayMove(
            cards.map((c, i) =>
              i === activeIndex ? { ...c, column: overCard.column } : c,
            ),
            activeIndex,
            newIndex,
          ),
        );
      } else if (activeIndex !== overIndex) {
        setCards(arrayMove(cards, activeIndex, overIndex));
      }
    }

    if (isOverColumn) {
      const activeCard = cards[activeIndex];
      const overColumnId = over.id as Column;
      if (activeCard.column !== overColumnId) {
        setCards(
          cards.map((c, i) =>
            i === activeIndex ? { ...c, column: overColumnId } : c,
          ),
        );
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeIndex = cards.findIndex((c) => c.id === active.id);
    const overIndex = cards.findIndex((c) => c.id === over.id);

    if (activeIndex === -1) return;

    const activeCard = cards[activeIndex];

    const newCards = arrayMove(cards, activeIndex, overIndex);

    const columnCards = newCards
      .filter((c) => c.column === activeCard.column)
      .sort((a, b) => newCards.indexOf(a) - newCards.indexOf(b));

    const visualIndexInCol = columnCards.findIndex(
      (c) => c.id === activeCard.id,
    );
    const prevCard = columnCards[visualIndexInCol - 1];
    const nextCard = columnCards[visualIndexInCol + 1];

    let newOrder = activeCard.order;

    if (!prevCard && !nextCard) newOrder = 1000;
    else if (!prevCard) newOrder = nextCard.order / 2;
    else if (!nextCard) newOrder = prevCard.order + 1000;
    else newOrder = (prevCard.order + nextCard.order) / 2;

    setCards(
      newCards.map((c) =>
        c.id === activeCard.id ? { ...c, order: newOrder } : c,
      ),
    );

    updateCardMutation.mutate({
      id: activeCard.id,
      data: {
        column: activeCard.column,
        order: newOrder,
      },
    });
  };

  return { handleDragOver, handleDragEnd };
}
