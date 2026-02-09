import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import React from 'react';
import { CardType } from '@/types/card.types';
import { useDeleteCard } from '@/hooks/use-card';
import { useTaskModalStore } from '@/store/task-modal.store';

interface TaskCardProps {
  card: CardType;
}

export function TaskCard({ card }: TaskCardProps) {
  const onOpenEdit = useTaskModalStore((state) => state.onOpenEdit);
  const deleteCardMutation = useDeleteCard();

  const borderColor = `var(--${
    card.column === 'TODO'
      ? 'chart-1'
      : card.column === 'IN_PROGRESS'
        ? 'chart-4'
        : 'chart-2'
  })`;

  const handleDelete = () => {
    deleteCardMutation.mutate(card.id);
  };

  return (
    <Card
      style={{ '--col': borderColor } as React.CSSProperties}
      className="group relative flex flex-col gap-4 p-5 border border-border/50 bg-card shadow-sm transition-all overflow-hidden
      hover:border-(--col) hover:-translate-y-1 hover:shadow-md"
    >
      <div
        className="absolute inset-x-0 -top-px h-1.5 w-full"
        style={{
          background: `linear-gradient(90deg, var(--col) 0%, transparent 100%)`,
        }}
      />

      <div className="flex flex-col gap-2 pt-2">
        <h4 className="text-base font-semibold text-card-foreground leading-tight break-all">
          {card.title}
        </h4>
        <p className="text-sm text-muted-foreground break-all">
          {card.description || 'No description provided...'}
        </p>
      </div>

      <div className="mt-2 flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-primary"
          onClick={() => onOpenEdit(card)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
