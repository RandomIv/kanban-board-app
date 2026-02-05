'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Trash2, Home, Copy, Check } from 'lucide-react';
import { BoardDeleteAlert } from './board-delete-alert';
import { useDeleteBoard } from '@/hooks/use-board';

interface BoardHeaderProps {
  boardId: string;
}

export function BoardHeader({ boardId: activeBoardId }: BoardHeaderProps) {
  const router = useRouter();
  const [navBoardId, setNavBoardId] = useState('');
  const [copied, setCopied] = useState(false);
  const deleteBoardMutation = useDeleteBoard();

  const handleOpenBoard = () => {
    if (navBoardId.trim()) {
      router.push(`/board/${navBoardId}`);
    }
  };

  const handleCopyBoardId = async () => {
    try {
      await navigator.clipboard.writeText(activeBoardId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy board ID:', error);
    }
  };

  const handleDeleteBoard = async () => {
    deleteBoardMutation.mutate(activeBoardId, {
      onSuccess: () => {
        router.push('/');
      },
    });
  };

  return (
    <header className="flex items-center gap-4 border-b border-border/40 p-4">
      <Button
        size="lg"
        className="h-12 text-xl font-bold bg-chart-1 hover:bg-chart-1/90 text-primary transition-all rounded-full shadow-lg hover:shadow-xl"
        onClick={() => router.push('/')}
        title="Return to Home"
      >
        <Home className="h-6 w-6" />
      </Button>

      <Button
        size="lg"
        variant="outline"
        className="h-12 text-xl font-bold rounded-xl shadow-lg transition-all"
        onClick={handleCopyBoardId}
        title="Copy Board ID"
      >
        {copied ? (
          <>
            <Check className="h-6 w-6 mr-2" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-6 w-6 mr-2" />
            Copy ID
          </>
        )}
      </Button>
      <Input
        className="h-12 flex-1 border-border border-3 bg-primary text-lg"
        placeholder="Enter a board ID here..."
        value={navBoardId}
        onChange={(e) => setNavBoardId(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleOpenBoard()}
      />

      <Button
        size="lg"
        className="h-12 text-xl font-bold bg-chart-1 hover:bg-chart-1/90 text-primary transition-all rounded-xl shadow-lg hover:shadow-xl"
        onClick={handleOpenBoard}
        disabled={!navBoardId.trim()}
      >
        Open Board
        <ArrowRight className="ml-3 h-6 w-6" />
      </Button>

      <BoardDeleteAlert onConfirm={handleDeleteBoard}>
        <Button
          size="lg"
          variant="destructive"
          className="h-12 rounded-xl text-xl text-primary shadow-lg transition-all"
          title="Delete Board"
        >
          Delete Board
          <Trash2 className="h-6 w-6 ml-2" />
        </Button>
      </BoardDeleteAlert>
    </header>
  );
}
