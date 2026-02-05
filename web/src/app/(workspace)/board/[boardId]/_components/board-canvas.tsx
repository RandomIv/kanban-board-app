'use client';

import { useState, useEffect } from 'react';
import { useIsMutating } from '@tanstack/react-query';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';

import { BoardColumn } from './board-column';
import { TaskCard } from './task-card';

import { useDragAndDrop } from '@/hooks/use-drag-drop';
import { useBoardStore } from '@/store/board.store';
import { CardType } from '@/types/card.types';
import { BoardType } from '@/types/board.types';

interface BoardCanvasProps {
  boardId: string;
  initialBoardData: BoardType;
  isFetching: boolean;
}

export function BoardCanvas({
  boardId,
  initialBoardData,
  isFetching,
}: BoardCanvasProps) {
  const { cards, setCards } = useBoardStore();
  const { handleDragEnd, handleDragOver } = useDragAndDrop();

  const isMutating = useIsMutating();
  const [isDragging, setIsDragging] = useState(false);
  const [activeCard, setActiveCard] = useState<CardType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  useEffect(() => {
    if (
      initialBoardData?.cards &&
      !isDragging &&
      isMutating === 0 &&
      !isFetching
    ) {
      setCards([...initialBoardData.cards].sort((a, b) => a.order - b.order));
    }
  }, [initialBoardData?.cards, setCards, isDragging, isMutating, isFetching]);

  const onDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
    const card = event.active.data.current?.card;
    if (card) {
      setActiveCard(card);
    }
  };

  const onDragEndWrapper = (event: DragEndEvent) => {
    handleDragEnd(event);
    setTimeout(() => {
      setIsDragging(false);
      setActiveCard(null);
    }, 50);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEndWrapper}
      onDragOver={handleDragOver}
    >
      <div className="flex h-full min-w-max gap-6 p-6">
        <BoardColumn
          id="TODO"
          title="To Do"
          cards={cards.filter((el) => el.column === 'TODO')}
          boardId={boardId}
        />
        <BoardColumn
          id="IN_PROGRESS"
          title="In Progress"
          cards={cards.filter((el) => el.column === 'IN_PROGRESS')}
          boardId={boardId}
        />
        <BoardColumn
          id="DONE"
          title="Done"
          cards={cards.filter((el) => el.column === 'DONE')}
          boardId={boardId}
        />
      </div>

      <DragOverlay>
        {activeCard ? (
          <div className="opacity-80 rotate-2 cursor-grabbing">
            <TaskCard card={activeCard} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
