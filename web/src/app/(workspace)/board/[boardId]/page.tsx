'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { BoardColumn } from './_components/board-column';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardType } from '@/types/card.types';
import { ArrowRight, Trash2 } from 'lucide-react';
import { DeleteBoardAlert } from '@/app/(workspace)/board/[boardId]/_components/delete-board-alert';

const MOCK_CARDS = [
  { title: 'Task 1', description: 'Description for task 1...' } as CardType,
  { title: 'Task 2', description: 'Description for task 2...' } as CardType,
  { title: 'Task 3', description: 'Description for task 3...' } as CardType,
];

export default function BoardPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { boardId: activeBoardId } = use(params);
  const router = useRouter();
  const [boardId, setBoardId] = useState('');

  const handleOpenBoard = () => {
    if (boardId.trim()) {
      router.push(`/board/${boardId}`);
    }
  };

  const handleDeleteBoard = async () => {
    console.log(`Deleting board: ${activeBoardId}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push('/');
  };

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <header className="flex items-center gap-4 border-b border-border/40 p-4">
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
            className="h-12 rounded-xl text-xl text-primary shadow-lg hover:bg-chart-5/80 transition-all"
            title="Delete Board"
          >
            Delete Board
            <Trash2 className="h-6 w-6 ml-2" />
          </Button>
        </DeleteBoardAlert>
      </header>

      <main className="flex-1 overflow-x-auto overflow-y-hidden flex justify-center">
        <div className="flex h-full min-w-max gap-6 p-6">
          <BoardColumn
            id="TODO"
            title="To Do"
            cards={[MOCK_CARDS[0], MOCK_CARDS[1]]}
          />
          <BoardColumn
            id="IN_PROGRESS"
            title="In Progress"
            cards={[MOCK_CARDS[2]]}
          />
          <BoardColumn id="DONE" title="Done" cards={[]} />
        </div>
      </main>
    </div>
  );
}
