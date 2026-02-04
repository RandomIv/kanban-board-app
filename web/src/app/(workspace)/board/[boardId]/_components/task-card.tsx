import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import React from 'react';

interface TaskCardProps {
  title: string;
  description?: string;
  borderColor?: string;
}

export function TaskCard({
  title,
  description,
  borderColor = 'var(--primary)',
}: TaskCardProps) {
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
        <h4 className="text-base font-semibold text-card-foreground leading-tight">
          {title}
        </h4>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {description || 'No description provided...'}
        </p>
      </div>

      <div className="mt-2 flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-primary"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
