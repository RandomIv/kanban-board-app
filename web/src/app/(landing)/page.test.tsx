import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from './page';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockMutate = jest.fn();

jest.mock('@/hooks/use-board', () => ({
  useCreateBoard: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<Home />);

    expect(screen.getByText('Kanban Board')).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/e.g., my-project-board/i),
    ).toBeInTheDocument();

    const openBtn = screen.getByRole('button', { name: /open board/i });
    expect(openBtn).toBeInTheDocument();
    expect(openBtn).toBeDisabled();
  });

  describe('Open Existing Board Flow', () => {
    it('enables button when typing and redirects on click', () => {
      render(<Home />);

      const input = screen.getByPlaceholderText(/e.g., my-project-board/i);
      const button = screen.getByRole('button', { name: /open board/i });

      fireEvent.change(input, { target: { value: 'test-board-123' } });

      expect(button).toBeEnabled();

      fireEvent.click(button);

      expect(mockPush).toHaveBeenCalledWith('/board/test-board-123');
    });

    it('redirects when pressing Enter key', () => {
      render(<Home />);

      const input = screen.getByPlaceholderText(/e.g., my-project-board/i);

      fireEvent.change(input, { target: { value: 'enter-board-id' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      expect(mockPush).toHaveBeenCalledWith('/board/enter-board-id');
    });

    it('does not redirect if input is empty or whitespace', () => {
      render(<Home />);
      const input = screen.getByPlaceholderText(/e.g., my-project-board/i);

      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('Create New Board Flow', () => {
    it('calls mutation and redirects on success', () => {
      mockMutate.mockImplementation((data, options) => {
        options.onSuccess({ id: 'new-generated-id' });
      });

      render(<Home />);

      const createCardText = screen.getByText(/create new board/i);

      fireEvent.click(createCardText);

      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({ name: expect.stringContaining('Board') }),
        expect.anything(),
      );

      expect(mockPush).toHaveBeenCalledWith('/board/new-generated-id');
    });
  });
});
