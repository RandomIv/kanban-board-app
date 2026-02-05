import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import BoardPage from './page';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    use: (promise: Promise<unknown>) => {
      if (promise instanceof Promise) return { boardId: 'test-board-1' };
      return promise;
    },
  };
});

const mockUseBoard = jest.fn();
jest.mock('@/hooks/use-board', () => ({
  useBoard: (id: string) => mockUseBoard(id),
}));

jest.mock('./_components/board-header', () => ({
  BoardHeader: () => <div data-testid="mock-header">Mock Header</div>,
}));

jest.mock('./_components/board-title', () => ({
  BoardTitle: ({ initialTitle }: { initialTitle: string }) => (
    <div data-testid="mock-title">Title: {initialTitle}</div>
  ),
}));

jest.mock('./_components/board-canvas', () => ({
  BoardCanvas: () => <div data-testid="mock-canvas">Mock Canvas</div>,
}));

describe('Board Page', () => {
  const params = Promise.resolve({ boardId: 'test-board-1' });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state correctly', async () => {
    mockUseBoard.mockReturnValue({
      isLoading: true,
      data: null,
    });

    await act(async () => {
      render(<BoardPage params={params} />);
    });

    expect(screen.getByText('Loading board...')).toBeInTheDocument();
  });

  it('shows error state and redirect button', async () => {
    mockUseBoard.mockReturnValue({
      isLoading: false,
      isError: true,
      error: { message: 'Access Denied' },
    });

    await act(async () => {
      render(<BoardPage params={params} />);
    });

    expect(screen.getByText('Access Denied')).toBeInTheDocument();

    const backBtn = screen.getByRole('button', { name: /go back home/i });
    expect(backBtn).toBeInTheDocument();

    fireEvent.click(backBtn);
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('renders board components on success', async () => {
    const mockBoardData = { id: 'test-board-1', name: 'My Kanban' };

    mockUseBoard.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockBoardData,
      isFetching: false,
    });

    await act(async () => {
      render(<BoardPage params={params} />);
    });

    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-title')).toHaveTextContent(
      'Title: My Kanban',
    );
    expect(screen.getByTestId('mock-canvas')).toBeInTheDocument();
    expect(mockUseBoard).toHaveBeenCalledWith('test-board-1');
  });
});
