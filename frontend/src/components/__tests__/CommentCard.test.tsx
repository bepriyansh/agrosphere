import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import CommentCard from '../comments/commentCard';
import { useAuth } from '../../auth/useAuth';
import '@testing-library/jest-dom';
import type { IComment, IUser } from '../../api/types';

vi.mock('../../auth/useAuth', () => ({
    useAuth: vi.fn(),
}));

describe('CommentCard Component', () => {
    const mockUser: IUser = {
        id: 'user1',
        username: 'testuser',
        role: 'user',
        profilePicture: 'https://example.com/avatar.jpg',
    };

    const mockComment: IComment = {
        _id: '1',
        description: 'This is a test comment.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: mockUser,
        post: 'post1',
        aiReply: '',
    };

    const mockAIComment: IComment = {
        ...mockComment,
        user: {
            ...mockUser,
            role: 'ai',
        },
        aiReply: 'This is an AI reply.',
    };

    const mockAuthUser: IUser = {
        id: 'user1',
        username: 'testuser',
        role: 'user',
        profilePicture: 'https://example.com/avatar.jpg',
    };

    const mockOnDelete = vi.fn().mockResolvedValue(undefined);

    const mockAuthContext = {
        user: mockAuthUser,
        login: vi.fn(),
        logout: vi.fn(),
        isAuthenticated: true,
    };

    beforeEach(() => {
        vi.mocked(useAuth).mockReturnValue(mockAuthContext);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders comment content correctly', () => {
        render(<CommentCard comment={mockComment} />);
        expect(screen.getByText('This is a test comment.')).toBeInTheDocument();
        expect(screen.getByText('testuser')).toBeInTheDocument();
    });

    it('displays AI chip for AI comments', () => {
        render(<CommentCard comment={mockAIComment} />);
        const aiChips = screen.getAllByText('AI');
        expect(aiChips.length).toBeGreaterThan(0);
        const aiGeneratedElements = screen.getAllByText(/AI-generated/i);
        expect(aiGeneratedElements.length).toBeGreaterThan(0);
    });

    it('displays AI reply when present', () => {
        render(<CommentCard comment={mockAIComment} />);
        expect(screen.getByText('This is an AI reply.')).toBeInTheDocument();
        expect(screen.getByText('AI Assistant')).toBeInTheDocument();
    });

    it('shows delete option for owner of the comment', () => {
        render(<CommentCard comment={mockComment} onDelete={mockOnDelete} />);
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByText('Delete Comment')).toBeInTheDocument();
    });

    it('does not show delete option for non-owner', () => {
        vi.mocked(useAuth).mockReturnValue({
            ...mockAuthContext,
            user: { ...mockAuthUser, id: 'differentUser' }
        });
        render(<CommentCard comment={mockComment} onDelete={mockOnDelete} />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('does not show delete option for AI comments even if owner', () => {
        render(<CommentCard comment={mockAIComment} onDelete={mockOnDelete} />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('calls onDelete when delete is clicked', async () => {
        render(<CommentCard comment={mockComment} onDelete={mockOnDelete} />);
        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('Delete Comment'));
        expect(mockOnDelete).toHaveBeenCalledWith('1');
    });

    it('displays loading state when deleting', () => {
        render(<CommentCard comment={mockComment} onDelete={mockOnDelete} isDeleting={true} />);
        expect(screen.getByText('Deleting Comment...')).toBeInTheDocument();
        const progressbars = screen.getAllByRole('img');
        expect(progressbars.length).toBeGreaterThan(0);
    });
});
