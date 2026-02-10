import { DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Column } from '@/types/card.types';
import { useUpdateCard } from './use-card';
import { useBoardStore } from '@/store/board.store';

export function useDragAndDrop() {
  const { cards, setCards } = useBoardStore();
  const updateCardMutation = useUpdateCard();

  // Move the card visually while dragging.
  // Update the local state immediately so the user sees the card "land" before dropping.
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Check types using 'data' passed to useSortable/useDroppable
    const isActiveCard = active.data.current?.type === 'card';
    const isOverCard = over.data.current?.type === 'card';
    const isOverColumn = over.data.current?.type === 'column';

    if (!isActiveCard) return;

    const activeIndex = cards.findIndex((c) => c.id === active.id);
    const overIndex = cards.findIndex((c) => c.id === over.id);

    if (activeIndex === -1) return;

    // 1. Moving over another Card
    if (isOverCard) {
      if (overIndex === -1) return;
      const activeCard = cards[activeIndex];
      const overCard = cards[overIndex];

      // Case A: Moving between different columns
      if (activeCard.column !== overCard.column) {
        // Calculate if we are dropping above or below the target
        const isBelowOverItem =
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;

        const modifier = isBelowOverItem ? 1 : 0;
        const newIndex =
          overIndex >= 0 ? overIndex + modifier : cards.length + 1;

        // Update column and position visually
        setCards(
          arrayMove(
            cards.map((c, i) =>
              i === activeIndex ? { ...c, column: overCard.column } : c,
            ),
            activeIndex,
            newIndex,
          ),
        );
      }
      // Case B: Reordering in the same column
      else if (activeIndex !== overIndex) {
        setCards(arrayMove(cards, activeIndex, overIndex));
      }
    }

    // 2. Moving to an empty column (or column background)
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

  // Calculate the exact math and save to DB.
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeIndex = cards.findIndex((c) => c.id === active.id);
    const overIndex = cards.findIndex((c) => c.id === over.id);

    if (activeIndex === -1) return;

    const activeCard = cards[activeIndex];
    const newCards = arrayMove(cards, activeIndex, overIndex);

    // Filter cards of the target column to find neighbors (prev/next)
    const columnCards = newCards
      .filter((c) => c.column === activeCard.column)
      .sort((a, b) => newCards.indexOf(a) - newCards.indexOf(b));

    const visualIndexInCol = columnCards.findIndex(
      (c) => c.id === activeCard.id,
    );
    const prevCard = columnCards[visualIndexInCol - 1];
    const nextCard = columnCards[visualIndexInCol + 1];

    // Floating Point Arithmetic for O(1) reordering.
    // Instead of shifting all indexes (1, 2, 3...), we just find a number between neighbors.
    let newOrder = activeCard.order;

    if (!prevCard && !nextCard) newOrder = 1000;
    else if (!prevCard) newOrder = nextCard.order / 2;
    else if (!nextCard) newOrder = prevCard.order + 1000;
    else newOrder = (prevCard.order + nextCard.order) / 2;

    // Update UI instantly
    setCards(
      newCards.map((c) =>
        c.id === activeCard.id ? { ...c, order: newOrder } : c,
      ),
    );

    // Sync with Server
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
