'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { BoardColumn } from './_components/board-column';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Trash2, Pencil, Check, X, Home } from 'lucide-react';
import { DeleteBoardAlert } from '@/app/(workspace)/board/[boardId]/_components/delete-board-alert';
import { useBoard, useDeleteBoard, useUpdateBoard } from '@/hooks/use-board';

export default function BoardPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { boardId: activeBoardId } = use(params);
  const router = useRouter();
  const [boardId, setBoardId] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');

  const { data: board, error, isError, isLoading } = useBoard(activeBoardId);
  const updateBoardMutation = useUpdateBoard();
  const deleteBoardMutation = useDeleteBoard();

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

  const handleOpenBoard = () => {
    if (boardId.trim()) {
      router.push(`/board/${boardId}`);
    }
  };

  const handleDeleteBoard = async () => {
    deleteBoardMutation.mutate(activeBoardId, {
      onSuccess: () => {
        router.push('/');
      },
    });
  };

  const handleStartEditing = () => {
    setEditedTitle(board?.name || '');
    setIsEditingTitle(true);
  };

  const handleSaveTitle = () => {
    if (editedTitle.trim() && editedTitle !== board?.name) {
      updateBoardMutation.mutate({
        id: activeBoardId,
        data: { name: editedTitle.trim() },
      });
    }
    setIsEditingTitle(false);
  };

  const handleCancelEditing = () => {
    setIsEditingTitle(false);
    setEditedTitle('');
  };

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <header className="flex items-center gap-4 border-b border-border/40 p-4">
        <Button
          size="lg"
          className="h-12 text-xl font-bold bg-chart-1 hover:bg-chart-1/90 text-primary transition-all rounded-full shadow-lg hover:shadow-xl"
          onClick={() => router.push('/')}
          title="Return to Home"
        >
          <Home className="h-6 w-6" />
        </Button>
        <Input
          className="h-12 flex-1 border-border border-3 bg-primary text-lg"
          placeholder="Enter a board ID here..."
          value={boardId}
          onChange={(e) => setBoardId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleOpenBoard()}
        />
        <Button
          size="lg"
          className="h-12 text-xl font-bold bg-chart-1 hover:bg-chart-1/90 text-primary transition-all rounded-xl shadow-lg hover:shadow-xl"
          onClick={handleOpenBoard}
          disabled={!boardId.trim()}
        >
          Open Board
          <ArrowRight className="ml-3 h-6 w-6" />
        </Button>
        <DeleteBoardAlert onConfirm={handleDeleteBoard}>
          <Button
            size="lg"
            variant="destructive"
            className="h-12 rounded-xl text-xl text-primary shadow-lg transition-all"
            title="Delete Board"
          >
            Delete Board
            <Trash2 className="h-6 w-6 ml-2" />
          </Button>
        </DeleteBoardAlert>
      </header>

      <div className="border-b border-border/40 bg-secondary/5 px-6 py-6">
        <div className="flex items-center justify-center gap-3">
          {isEditingTitle ? (
            <>
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
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
                {board.name}
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

      <main className="flex-1 overflow-x-auto overflow-y-hidden flex justify-center">
        <div className="flex h-full min-w-max gap-6 p-6">
          <BoardColumn
            id="TODO"
            title="To Do"
            cards={board.cards.filter((el) => el.column === 'TODO')}
          />
          <BoardColumn
            id="IN_PROGRESS"
            title="In Progress"
            cards={board.cards.filter((el) => el.column === 'IN_PROGRESS')}
          />
          <BoardColumn
            id="DONE"
            title="Done"
            cards={board.cards.filter((el) => el.column === 'DONE')}
          />
        </div>
      </main>
    </div>
  );
}
