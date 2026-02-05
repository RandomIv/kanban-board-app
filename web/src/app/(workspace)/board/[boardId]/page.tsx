'use client';

import { use, useEffect, useState } from 'react';
import { useIsMutating } from '@tanstack/react-query'; // Залиш це
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

import { BoardColumn } from './_components/board-column';
import { BoardHeader } from './_components/board-header';
import { BoardTitle } from './_components/board-title';
import { TaskCard } from './_components/task-card';

import { useBoard } from '@/hooks/use-board';
import { useDragAndDrop } from '@/hooks/use-drag-drop';
import { useBoardStore } from '@/store/board.store';
import { CardType } from '@/types/card.types';

export default function BoardPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { boardId: activeBoardId } = use(params);

  const {
    data: board,
    error,
    isError,
    isLoading,
    isFetching,
  } = useBoard(activeBoardId);

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
    if (board?.cards && !isDragging && isMutating === 0 && !isFetching) {
      setCards([...board.cards].sort((a, b) => a.order - b.order));
    }
  }, [board?.cards, setCards, isDragging, isMutating, isFetching]);

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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <div className="animate-pulse">Loading board...</div>
      </div>
    );
  }

  if (isError || !board) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-destructive">
        {error?.message || 'Failed to load board.'}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEndWrapper}
      onDragOver={handleDragOver}
    >
      <div className="flex h-screen flex-col bg-background text-foreground">
        <BoardHeader boardId={activeBoardId} />
        <BoardTitle boardId={activeBoardId} initialTitle={board.name} />

        <main className="flex-1 overflow-x-auto overflow-y-hidden flex justify-center">
          <div className="flex h-full min-w-max gap-6 p-6">
            <BoardColumn
              id="TODO"
              title="To Do"
              cards={cards.filter((el) => el.column === 'TODO')}
              boardId={activeBoardId}
            />
            <BoardColumn
              id="IN_PROGRESS"
              title="In Progress"
              cards={cards.filter((el) => el.column === 'IN_PROGRESS')}
              boardId={activeBoardId}
            />
            <BoardColumn
              id="DONE"
              title="Done"
              cards={cards.filter((el) => el.column === 'DONE')}
              boardId={activeBoardId}
            />
          </div>
        </main>

        <DragOverlay>
          {activeCard ? (
            <div className="opacity-80 rotate-2 cursor-grabbing">
              <TaskCard card={activeCard} />
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
