'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Kanban, ArrowRight, Plus } from 'lucide-react';
import { useCreateBoard } from '@/hooks/use-board';

export default function Home() {
  const router = useRouter();
  const [boardId, setBoardId] = useState('');
  const createBoardMutation = useCreateBoard();

  const handleCreateNewBoard = () => {
    const boardName = `Board ${Date.now()}`;
    createBoardMutation.mutate(
      { name: boardName },
      {
        onSuccess: (data) => {
          router.push(`/board/${data.id}`);
        },
      },
    );
  };

  const handleOpenBoard = () => {
    if (boardId.trim()) {
      router.push(`/board/${boardId}`);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <header className="flex flex-col items-center gap-3 border-b border-border/40 px-10 py-10">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-chart-1/20">
            <Kanban className="h-8 w-8 text-chart-1" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-foreground">
            Kanban Board
          </h1>
        </div>
        <p className="text-xl text-muted-foreground text-center max-w-2xl">
          Organize your tasks, boost productivity, and achieve your goals
        </p>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center overflow-y-auto p-10">
        <div className="w-full max-w-6xl space-y-16 overflow-hidden">
          <Card className="relative overflow-hidden rounded-2xl border-2 border-border/50 bg-card p-12 shadow-xl">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 rounded-t-2xl bg-linear-to-b from-chart-1/20 to-transparent opacity-60" />

            <div className="relative z-10 space-y-8">
              <div className="space-y-4">
                <label
                  htmlFor="board-id"
                  className="block text-2xl font-bold text-foreground"
                >
                  Enter existing Board ID
                </label>
                <Input
                  id="board-id"
                  placeholder="e.g., my-project-board"
                  type="text"
                  className="h-16 text-xl border-2 border-border/50 bg-secondary/20 focus:border-chart-1 transition-all rounded-xl px-6"
                  value={boardId}
                  onChange={(e) => setBoardId(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleOpenBoard();
                  }}
                />
              </div>
              <Button
                size="lg"
                className="h-16 w-full text-xl font-bold bg-chart-1 hover:bg-chart-1/90 text-primary transition-all rounded-xl shadow-lg hover:shadow-xl"
                onClick={handleOpenBoard}
                disabled={!boardId.trim()}
              >
                Open Board
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </div>
          </Card>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-4 text-muted-foreground font-medium">
                OR
              </span>
            </div>
          </div>

          <Card
            className="relative overflow-hidden rounded-xl border-2 border-border/50 bg-card p-8 shadow-xl transition-all hover:shadow-2xl hover:border-chart-2/50 cursor-pointer group"
            onClick={handleCreateNewBoard}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 rounded-t-2xl bg-linear-to-b from-chart-2/20 to-transparent opacity-60" />

            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-chart-2/20 transition-all group-hover:scale-110 group-hover:bg-chart-2/30">
                <Plus className="h-10 w-10 text-chart-2" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-foreground">
                  Create New Board
                </h2>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
