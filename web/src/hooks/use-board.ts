import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { boardService } from '@/services/board.service';
import { CreateBoardDto, UpdateBoardDto } from '@/types/board.types';

export const useBoard = (id: string) => {
  return useQuery({
    queryKey: ['board', id],
    queryFn: () => boardService.getById(id),
    enabled: !!id,
  });
};

export const useCreateBoard = () => {
  return useMutation({
    mutationFn: (data: CreateBoardDto) => boardService.create(data),
  });
};

export const useUpdateBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBoardDto }) =>
      boardService.update(id, data),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['board'] });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['board', data.id] });
    },
  });
};

export const useDeleteBoard = () => {
  return useMutation({
    mutationFn: (id: string) => boardService.delete(id),
  });
};
