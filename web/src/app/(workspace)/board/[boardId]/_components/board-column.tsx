import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CardType, Column } from '@/types/card.types';
import React, { useState } from 'react';
import { TaskDialog } from '@/app/(workspace)/board/[boardId]/_components/task-dialog';
import { useCreateCard } from '@/hooks/use-card';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DraggableCard } from './draggable-card';

interface BoardColumnProps {
  id: Column;
  title: string;
  cards: CardType[];
  boardId: string;
}

const COLOR_MAP: Record<Column, string> = {
  TODO: 'chart-1',
  IN_PROGRESS: 'chart-4',
  DONE: 'chart-2',
};

export function BoardColumn({
  id,
  title,
  cards = [],
  boardId,
}: BoardColumnProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const createCardMutation = useCreateCard();

  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'column',
      columnId: id,
    },
  });

  const handleCreate = async (data: {
    title: string;
    description?: string;
  }) => {
    createCardMutation.mutate(
      {
        ...data,
        column: id,
        boardId: boardId,
      },
      {
        onSuccess: () => {
          setIsCreateOpen(false);
        },
      },
    );
  };

  const colorVar = `var(--${COLOR_MAP[id]})`;
  const cardIds = cards.map((card) => card.id);

  return (
    <div
      style={{ '--col': colorVar } as React.CSSProperties}
      className="relative flex h-full w-112.5 shrink-0 flex-col rounded-xl border border-border/50 bg-secondary/10 p-6"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 rounded-full bg-(--col) shadow-sm" />
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        </div>
        <div className="flex h-7 min-w-7 items-center justify-center rounded-full bg-secondary px-2.5 text-sm font-medium text-secondary-foreground">
          {cards.length}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 rounded-t-xl bg-linear-to-b from-(--col) to-transparent opacity-10" />

      <div className="relative flex flex-1 flex-col gap-6 overflow-hidden">
        <div className="flex-1 -mx-6 px-6 overflow-hidden">
          <ScrollArea className="h-full">
            <div
              ref={setNodeRef}
              className={`flex flex-col gap-4 py-2 min-h-25 transition-colors ${
                isOver ? 'bg-accent/10 rounded-lg' : ''
              }`}
            >
              <SortableContext
                items={cardIds}
                strategy={verticalListSortingStrategy}
              >
                {cards.map((card) => (
                  <DraggableCard key={card.id} card={card} />
                ))}
              </SortableContext>
            </div>
          </ScrollArea>
        </div>

        <Button
          variant="ghost"
          className="h-14 w-full border-2 border-dashed border-(--col)/40 bg-transparent text-base text-muted-foreground hover:border-(--col) hover:bg-(--col)/10 hover:text-(--col) hover:cursor-pointer"
          onClick={() => setIsCreateOpen(true)}
        >
          <Plus className="mr-2 h-5 w-5" /> Add Task
        </Button>
      </div>
      <TaskDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}
