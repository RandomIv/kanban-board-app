'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Check, X } from 'lucide-react';
import { useUpdateBoard } from '@/hooks/use-board';

interface BoardTitleProps {
  boardId: string;
  initialTitle: string;
}

export function BoardTitle({ boardId, initialTitle }: BoardTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);

  const updateBoardMutation = useUpdateBoard();

  const handleStartEditing = () => {
    setTitle(initialTitle);
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setTitle(initialTitle);
  };

  const handleSaveTitle = () => {
    if (title.trim() && title !== initialTitle) {
      updateBoardMutation.mutate({
        id: boardId,
        data: { name: title.trim() },
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="border-b border-border/40 bg-secondary/5 px-6 py-6">
      <div className="flex items-center justify-center gap-3">
        {isEditing ? (
          <>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle();
                if (e.key === 'Escape') handleCancelEditing();
              }}
              className="h-12 max-w-md border-2 border-chart-1 bg-secondary/20 text-center text-3xl font-bold text-foreground"
              autoFocus
            />
            <Button
              size="icon"
              onClick={handleSaveTitle}
              className="h-10 w-10 rounded-full bg-chart-2 hover:bg-chart-2/90 text-primary"
            >
              <Check className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              onClick={handleCancelEditing}
              className="h-10 w-10 rounded-full bg-chart-5 hover:bg-chart-5/90 text-primary"
            >
              <X className="h-5 w-5" />
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-foreground text-center">
              {initialTitle}
            </h1>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleStartEditing}
              className="h-10 w-10 rounded-lg hover:bg-secondary/50 opacity-60 hover:opacity-100 transition-opacity"
            >
              <Pencil className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
