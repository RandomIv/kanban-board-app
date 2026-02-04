import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TaskCard } from './task-card';
import { CardType, Column } from '@/types/card.types';
import React from 'react';

interface BoardColumnProps {
  id: Column;
  title: string;
  cards?: CardType[];
}

const COLOR_MAP: Record<Column, string> = {
  TODO: 'chart-1',
  IN_PROGRESS: 'chart-4',
  DONE: 'chart-2',
};

export function BoardColumn({ id, title, cards = [] }: BoardColumnProps) {
  const colorVar = `var(--${COLOR_MAP[id]})`;

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

      <div className="relative z-10 flex flex-1 flex-col gap-6">
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-4 pt-4">
            {cards.map((c, i) => (
              <TaskCard
                key={i}
                title={c.title}
                description={c.description}
                borderColor={colorVar}
              />
            ))}
          </div>
        </ScrollArea>

        <Button
          variant="ghost"
          className="h-14 w-full border-2 border-dashed border-(--col)/40 bg-transparent text-base text-muted-foreground hover:border-(--col) hover:bg-(--col)/10 hover:text-(--col) hover:cursor-pointer"
        >
          <Plus className="mr-2 h-5 w-5" /> Add Task
        </Button>
      </div>
    </div>
  );
}
