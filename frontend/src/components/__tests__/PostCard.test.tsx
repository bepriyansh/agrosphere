import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import PostCard from '../post/card';
import { useAuth } from '../../auth/useAuth';
import { usePost } from '../../post/PostContext';
import { useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';
import type { IPost, IUser } from '../../api/types';

vi.mock('../../auth/useAuth', () => ({ useAuth: vi.fn() }));
vi.mock('../../post/PostContext', () => ({ usePost: vi.fn() }));
vi.mock('react-router-dom', () => ({ useNavigate: vi.fn() }));
vi.mock('../post/carousel', () => ({
  __esModule: true,
  default: ({ images }: { images: string[] }) => (
    <div data-testid="carousel">{images.join(',')}</div>
  ),
}));
vi.mock('../FormattedText', () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => <span>{text}</span>,
}));

const mockUser: IUser = {
  id: 'u1',
  username: 'user1',
  role: 'user',
  profilePicture: 'https://example.com/avatar.jpg',
};

const mockPost: IPost = {
  _id: 'p1',
  description: 'Hello world!',
  images: ['img1.jpg', 'img2.jpg'],
  user: mockUser,
  isLiked: false,
  totalLikes: 5,
  totalComments: 2,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockAuthContext = {
  user: mockUser,
  login: vi.fn(),
  logout: vi.fn(),
  isAuthenticated: true,
};

const mockPostContext = {
  posts: [],
  fetchPosts: vi.fn(),
  refreshPosts: vi.fn(),
  hasMore: true,
  getPostById: vi.fn(),
  toggleLike: vi.fn(),
  likingPosts: new Set<string>(),
  deletePost: vi.fn().mockResolvedValue(undefined),
  deletingPosts: new Set<string>(),
};

describe('PostCard Component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue(mockAuthContext);
    vi.mocked(usePost).mockReturnValue(mockPostContext);
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders post content and user info', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('Hello world!')).toBeInTheDocument();
    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders images carousel if images exist', () => {
    render(<PostCard post={mockPost} />);
    const carousel = screen.getByTestId('carousel');
    expect(carousel).toBeInTheDocument();
    expect(carousel).toHaveTextContent('img1.jpg,img2.jpg');
  });

  it('calls toggleLike when like button is clicked', () => {
    render(<PostCard post={mockPost} />);
    const likeButton = screen.getByLabelText('like');
    fireEvent.click(likeButton);
    expect(mockPostContext.toggleLike).toHaveBeenCalledWith('p1');
  });

  it('calls navigate when comment button is clicked', () => {
    render(<PostCard post={mockPost} />);
    const commentButton = screen.getByLabelText('comment');
    fireEvent.click(commentButton);
    expect(mockNavigate).toHaveBeenCalledWith('/post/p1');
  });

  it('shows menu and calls deletePost when delete is clicked (owner)', async () => {
    render(<PostCard post={mockPost} />);
    const menuButton = screen.getByLabelText('more-options');
    fireEvent.click(menuButton);

    const deleteMenuItem = await screen.findByText('Delete Post');
    fireEvent.click(deleteMenuItem);

    await waitFor(() => {
      expect(mockPostContext.deletePost).toHaveBeenCalledWith('p1');
    });
  });

  it('does not show menu if not owner', () => {
    vi.mocked(useAuth).mockReturnValue({
      ...mockAuthContext,
      user: { ...mockUser, id: 'other' },
    });
    render(<PostCard post={mockPost} />);
    expect(screen.queryByLabelText('more-options')).not.toBeInTheDocument();
  });

  it('shows deleting overlay when deleting', () => {
    vi.mocked(usePost).mockReturnValue({
      ...mockPostContext,
      deletingPosts: new Set([mockPost._id]),
    });
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('Deleting Post')).toBeInTheDocument();
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('disables all action buttons when deleting', () => {
    vi.mocked(usePost).mockReturnValue({
      ...mockPostContext,
      deletingPosts: new Set([mockPost._id]),
    });
    render(<PostCard post={mockPost} />);
    ['like', 'comment', 'share', 'more-options']
      .forEach(label => expect(screen.getByLabelText(label)).toBeDisabled());
  });
});
