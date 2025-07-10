import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Navbar from '../headers/nav';
import { useAuth } from '../../auth/useAuth';
import { useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';

vi.mock('../../auth/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('../../api/auth', () => ({
  logoutApi: vi.fn().mockResolvedValue(undefined),
}));

const mockUser = {
  id: '1',
  username: 'testuser',
  profilePicture: 'https://example.com/avatar.jpg',
};

const mockAuthContext = {
  user: mockUser,
  logout: vi.fn(),
  login: vi.fn(),
  isAuthenticated: true,
};

describe('Navbar Component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders logo correctly', () => {
    vi.mocked(useAuth).mockReturnValue({ ...mockAuthContext, user: null, isAuthenticated: false });
    render(<Navbar />);
    expect(screen.getByText('R')).toBeInTheDocument();
  });

  it('displays login button when user is not authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({ ...mockAuthContext, user: null, isAuthenticated: false });
    render(<Navbar />);
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('displays username and avatar when user is authenticated', () => {
    vi.mocked(useAuth).mockReturnValue(mockAuthContext);
    render(<Navbar />);
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-button')).toBeInTheDocument();
  });

  it('opens dropdown menu when avatar is clicked', () => {
    vi.mocked(useAuth).mockReturnValue(mockAuthContext);
    render(<Navbar />);
    const avatarButton = screen.getByTestId('avatar-button');
    fireEvent.click(avatarButton);
    expect(screen.getByText('My Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('calls logout function when logout menu item is clicked', async () => {
    const logoutMock = vi.fn();
    vi.mocked(useAuth).mockReturnValue({ ...mockAuthContext, logout: logoutMock });
    render(<Navbar />);
    const avatarButton = screen.getByTestId('avatar-button');

    await act(async () => {
      fireEvent.click(avatarButton);
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Logout'));
    });

    // Wait for any async operations to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(logoutMock).toHaveBeenCalled();
  });
});
