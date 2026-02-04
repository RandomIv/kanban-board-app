'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger, // Import Trigger
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';
import React from 'react';

interface DeleteBoardAlertProps {
  onConfirm: () => Promise<void>;
  children: React.ReactNode;
}

export function DeleteBoardAlert({
  onConfirm,
  children,
}: DeleteBoardAlertProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      setOpen(false);
    } catch (error) {
      console.error('Failed to delete', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent
        className="
        sm:max-w-lg
        p-8
        border border-border/50 border-t-4 border-t-destructive
        shadow-2xl shadow-destructive/5
        bg-card
      "
      >
        <AlertDialogHeader className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-2">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>

          <div className="space-y-2">
            <AlertDialogTitle className="text-2xl font-bold tracking-tight">
              Delete this board?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-muted-foreground max-w-sm mx-auto">
              This action cannot be undone. This will permanently remove the
              board and all its tasks from our servers.
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="w-full flex-row items-center justify-center gap-4 mt-6 sm:justify-center sm:space-x-0">
          <AlertDialogCancel
            disabled={isLoading}
            className="mt-0 w-32 h-11 text-base border-2"
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={isLoading}
            variant="destructive"
            className="w-32 h-11 text-base font-semibold"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
