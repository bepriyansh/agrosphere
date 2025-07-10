import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import CommentSection from '../comments/commentSection';
import { getComments, deleteComment } from '../../api/post';
import { useAuth } from '../../auth/useAuth';
import '@testing-library/jest-dom';
import type { IComment, IUser } from '../../api/types';

vi.mock('../../api/post', () => ({
  getComments: vi.fn(),
  deleteComment: vi.fn(),
}));

vi.mock('../../auth/useAuth', () => ({
  useAuth: vi.fn(),
}));

const mockUser: IUser = {
  id: 'u1',
  username: 'user1',
  role: 'user',
  profilePicture: 'https://example.com/avatar1.jpg',
};

const mockComments: IComment[] = [
  {
    _id: 'c1',
    description: 'First comment',
    aiReply: '',
    user: mockUser,
    post: 'p1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'c2',
    description: 'Second comment',
    aiReply: '',
    user: {
      id: 'u2',
      username: 'user2',
      role: 'user',
      profilePicture: 'https://example.com/avatar2.jpg',
    },
    post: 'p1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockAuthContext = {
  user: mockUser,
  login: vi.fn(),
  logout: vi.fn(),
  isAuthenticated: true,
};

describe('CommentSection Component', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue(mockAuthContext);
    vi.mocked(getComments).mockClear();
    vi.mocked(deleteComment).mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders and fetches comments', async () => {
    vi.mocked(getComments).mockResolvedValueOnce({
      items: mockComments,
      currentPage: 1,
      totalPages: 1,
      totalItems: 2,
    });

    render(<CommentSection postId="p1" />);

    await waitFor(() => {
      expect(screen.getByText('First comment')).toBeInTheDocument();
      expect(screen.getByText('Second comment')).toBeInTheDocument();
    });

    expect(vi.mocked(getComments)).toHaveBeenCalledWith('p1', 1);
  });

  it('shows "No more comments." when all pages are loaded', async () => {
    vi.mocked(getComments).mockResolvedValueOnce({
      items: mockComments,
      currentPage: 1,
      totalPages: 1,
      totalItems: 2,
    });

    render(<CommentSection postId="p1" />);

    await waitFor(() => {
      expect(screen.getByText('No more comments.')).toBeInTheDocument();
    });
  });

  it('shows "No comments yet" if no comments', async () => {
    vi.mocked(getComments).mockResolvedValueOnce({
      items: [],
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
    });

    render(<CommentSection postId="p1" />);

    await waitFor(() => {
      expect(screen.getByText('No comments yet. Be the first to comment.')).toBeInTheDocument();
    });
  });

  it('calls deleteComment and removes comment from UI', async () => {
    vi.mocked(getComments).mockResolvedValueOnce({
      items: mockComments,
      currentPage: 1,
      totalPages: 1,
      totalItems: 2,
    });
    vi.mocked(deleteComment).mockResolvedValueOnce(undefined);

    render(<CommentSection postId="p1" />);

    await waitFor(() => {
      expect(screen.getByText('First comment')).toBeInTheDocument();
    });

    // Find the delete button for the first comment (user1's comment)
    const deleteButtons = screen.getAllByRole('button');
    fireEvent.click(deleteButtons[0]);

    // Click the actual delete menu item
    await waitFor(() => {
      const deleteMenuItem = screen.getByText('Delete Comment');
      fireEvent.click(deleteMenuItem);
    });

    await waitFor(() => {
      expect(vi.mocked(deleteComment)).toHaveBeenCalledWith('c1');
    });

    // Verify comment is removed from UI
    await waitFor(() => {
      expect(screen.queryByText('First comment')).not.toBeInTheDocument();
    });
  });

  it('fetches new comments when postId changes', async () => {
    const newComment: IComment = {
      _id: 'c3',
      description: 'Third comment',
      aiReply: '',
      user: mockUser,
      post: 'p2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // First render with p1
    vi.mocked(getComments).mockResolvedValueOnce({
      items: mockComments,
      currentPage: 1,
      totalPages: 1,
      totalItems: 2,
    });

    const { rerender } = render(<CommentSection postId="p1" />);

    await waitFor(() => {
      expect(screen.getByText('First comment')).toBeInTheDocument();
    });

    // Mock for p2
    vi.mocked(getComments).mockResolvedValueOnce({
      items: [newComment],
      currentPage: 1,
      totalPages: 1,
      totalItems: 1,
    });

    rerender(<CommentSection postId="p2" />);

    await waitFor(() => {
      expect(screen.getByText('Third comment')).toBeInTheDocument();
    });

    // Verify getComments was called with new postId
    expect(vi.mocked(getComments)).toHaveBeenLastCalledWith('p2', 1);
  });
});
