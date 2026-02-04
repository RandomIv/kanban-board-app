'use client';

import { use } from 'react';
import { BoardColumn } from './_components/board-column';
import { BoardHeader } from './_components/board-header';
import { BoardTitle } from './_components/board-title';
import { useBoard } from '@/hooks/use-board';

export default function BoardPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { boardId: activeBoardId } = use(params);

  const { data: board, error, isError, isLoading } = useBoard(activeBoardId);

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
    <div className="flex h-screen flex-col bg-background text-foreground">
      <BoardHeader boardId={activeBoardId} />

      <BoardTitle boardId={activeBoardId} initialTitle={board.name} />

      <main className="flex-1 overflow-x-auto overflow-y-hidden flex justify-center">
        <div className="flex h-full min-w-max gap-6 p-6">
          <BoardColumn
            id="TODO"
            title="To Do"
            cards={board.cards.filter((el) => el.column === 'TODO')}
            boardId={activeBoardId}
          />
          <BoardColumn
            id="IN_PROGRESS"
            title="In Progress"
            cards={board.cards.filter((el) => el.column === 'IN_PROGRESS')}
            boardId={activeBoardId}
          />
          <BoardColumn
            id="DONE"
            title="Done"
            cards={board.cards.filter((el) => el.column === 'DONE')}
            boardId={activeBoardId}
          />
        </div>
      </main>
    </div>
  );
}
