'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import { CardType } from '@/types/card.types';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
});

type TaskFormValues = z.infer<typeof formSchema>;

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CardType;
  onSubmit: (data: TaskFormValues) => void;
}

export function TaskDialog({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}: TaskDialogProps) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          title: initialData.title,
          description: initialData.description || '',
        });
      } else {
        form.reset({
          title: '',
          description: '',
        });
      }
    }
  }, [isOpen, initialData, form]);

  const handleSubmit = (data: TaskFormValues) => {
    onSubmit(data);
    form.reset();
  };

  const isEditing = !!initialData;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-135 border-border/50 bg-card shadow-xl">
        <DialogHeader className="space-y-3 pb-2">
          <DialogTitle className="text-2xl font-bold text-card-foreground">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            {isEditing
              ? 'Update the details of your task below.'
              : 'Fill in the information to create a new task.'}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 pt-2"
        >
          <FieldGroup className="gap-5">
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="task-title"
                    className="text-sm font-semibold text-card-foreground"
                  >
                    Task Title
                  </FieldLabel>
                  <Input
                    {...field}
                    id="task-title"
                    placeholder="e.g., Review pull requests"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                    className="h-11 text-base border-border/50 bg-background focus-visible:border-chart-1 focus-visible:ring-chart-1/30"
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={fieldState.error ? [fieldState.error] : []}
                    />
                  )}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="task-desc"
                    className="text-sm font-semibold text-card-foreground"
                  >
                    Description
                  </FieldLabel>
                  <InputGroup className="border-border/50 bg-background focus-within:border-chart-1 focus-within:ring-chart-1/30">
                    <InputGroupTextarea
                      {...field}
                      id="task-desc"
                      placeholder="Add any additional details..."
                      rows={5}
                      className="resize-none text-base"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon
                      align="block-end"
                      className="border-t border-border/30"
                    >
                      <InputGroupText className="tabular-nums text-xs font-medium text-muted-foreground">
                        {field.value?.length || 0}/500
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription className="text-xs text-muted-foreground/80">
                    Provide optional details.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError
                      errors={fieldState.error ? [fieldState.error] : []}
                    />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter className="gap-3 pt-4 border-t border-border/30">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-11 px-6 text-base font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-11 px-6 text-base font-semibold bg-chart-1 hover:bg-chart-1/90 text-primary shadow-lg hover:shadow-xl transition-all"
            >
              {isEditing ? 'Save Changes' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
