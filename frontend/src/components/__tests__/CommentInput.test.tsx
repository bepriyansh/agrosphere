import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import CommentInput from '../comments/commentInput';
import { useAuth } from '../../auth/useAuth';
import '@testing-library/jest-dom';

vi.mock('../../auth/useAuth', () => ({
  useAuth: vi.fn(),
}));

const mockUser = {
  id: '1',
  username: 'testuser',
  profilePicture: 'https://example.com/avatar.jpg',
};

const mockAuthContext = {
  user: mockUser,
  login: vi.fn(),
  logout: vi.fn(),
  isAuthenticated: true,
};

describe('CommentInput Component', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue(mockAuthContext);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders input and avatar', () => {
    render(<CommentInput onCommentSubmit={vi.fn()} />);
    expect(screen.getByPlaceholderText("What's on your mind?")).toBeInTheDocument();
    expect(screen.getByText('Share your thoughts...')).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('enables submit button only when comment is not empty', () => {
    render(<CommentInput onCommentSubmit={vi.fn()} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("What's on your mind?"), {
      target: { value: 'Hello world' },
    });

    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });

  it('shows character count when typing', () => {
    render(<CommentInput onCommentSubmit={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText("What's on your mind?"), {
      target: { value: 'Test comment' },
    });
    expect(screen.getByText(/12\/500 characters/)).toBeInTheDocument();
  });

  it('calls onCommentSubmit with correct values', async () => {
    const onCommentSubmit = vi.fn().mockResolvedValue(undefined);
    render(<CommentInput onCommentSubmit={onCommentSubmit} />);
    
    fireEvent.change(screen.getByPlaceholderText("What's on your mind?"), {
      target: { value: 'My comment' },
    });
    
    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
    });
    
    expect(onCommentSubmit).toHaveBeenCalledWith('My comment', false);
  });

  it('toggles askAI switch and passes correct value', async () => {
    const onCommentSubmit = vi.fn().mockResolvedValue(undefined);
    render(<CommentInput onCommentSubmit={onCommentSubmit} />);

    fireEvent.change(screen.getByPlaceholderText("What's on your mind?"), {
      target: { value: 'AI please' },
    });

    const switchInput = screen.getByRole('checkbox');
    fireEvent.click(switchInput);

    expect(screen.getByText('AI will respond to your comment')).toBeInTheDocument();

    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
    });
    
    expect(onCommentSubmit).toHaveBeenCalledWith('AI please', true);
  });

  it('shows loading spinner when isLoading is true', () => {
    render(<CommentInput onCommentSubmit={vi.fn()} isLoading />);
    
    fireEvent.change(screen.getByPlaceholderText("What's on your mind?"), {
      target: { value: 'Test content' },
    });
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('submits on Ctrl+Enter', async () => {
    const onCommentSubmit = vi.fn().mockResolvedValue(undefined);
    render(<CommentInput onCommentSubmit={onCommentSubmit} />);
    
    const input = screen.getByPlaceholderText("What's on your mind?");
    fireEvent.change(input, { target: { value: 'Quick submit' } });
    
    await act(async () => {
      fireEvent.keyDown(input, { key: 'Enter', ctrlKey: true });
    });
    
    expect(onCommentSubmit).toHaveBeenCalledWith('Quick submit', false);
  });

  it('does not allow more than 500 characters', () => {
    render(<CommentInput onCommentSubmit={vi.fn()} />);
    const input = screen.getByPlaceholderText("What's on your mind?");

    const exactLimit = 'a'.repeat(500);
    fireEvent.change(input, { target: { value: exactLimit } });

    expect(screen.getByText('500/500 characters')).toBeInTheDocument();

    const longText = 'a'.repeat(600);
    fireEvent.change(input, { target: { value: longText } });

    expect((input as HTMLTextAreaElement).value).toBe(exactLimit);
    expect(screen.getByText('500/500 characters')).toBeInTheDocument();
  });
});
