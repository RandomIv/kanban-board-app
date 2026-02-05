'use client';

import { use } from 'react';
import { BoardHeader } from './_components/board-header';
import { BoardTitle } from './_components/board-title';
import { BoardCanvas } from './_components/board-canvas';
import { useBoard } from '@/hooks/use-board';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Home } from 'lucide-react';

export default function BoardPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { boardId: activeBoardId } = use(params);
  const router = useRouter();
  const {
    data: board,
    error,
    isError,
    isLoading,
    isFetching,
  } = useBoard(activeBoardId);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <div className="animate-pulse text-4xl">Loading board...</div>
      </div>
    );
  }

  if (isError || !board) {
    return (
      <div className="flex h-screen flex-col gap-6 items-center justify-center bg-background">
        <div className="text-destructive text-4xl font-bold">
          {error?.message || 'Failed to load board.'}
        </div>
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.push('/')}
          className="gap-2"
        >
          <Home className="w-5 h-5" />
          Go back home
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <BoardHeader boardId={activeBoardId} />
      <BoardTitle boardId={activeBoardId} initialTitle={board.name} />

      <main className="flex-1 overflow-x-auto overflow-y-hidden flex justify-center">
        <BoardCanvas
          boardId={activeBoardId}
          initialBoardData={board}
          isFetching={isFetching}
        />
      </main>
    </div>
  );
}
