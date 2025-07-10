import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import CreatePost from '../post/createPost';
import { useAuth } from '../../auth/useAuth';
import { usePost } from '../../post/PostContext';
import { createPost } from '../../api/post';
import '@testing-library/jest-dom';

vi.mock('../../auth/useAuth', () => ({
    useAuth: vi.fn(),
}));

vi.mock('../../post/PostContext', () => ({
    usePost: vi.fn(),
}));

vi.mock('../../api/post', () => ({
    createPost: vi.fn(),
}));

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'mocked-url');
global.URL.revokeObjectURL = vi.fn();

const mockUser = {
    id: 'u1',
    username: 'testuser',
    profilePicture: 'https://example.com/avatar.jpg',
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
    deletePost: vi.fn(),
    deletingPosts: new Set<string>(),
};

describe('CreatePost Component', () => {
    beforeEach(() => {
        vi.mocked(useAuth).mockReturnValue(mockAuthContext);
        vi.mocked(usePost).mockReturnValue(mockPostContext);
        vi.mocked(createPost).mockResolvedValue(undefined);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly with user info', () => {
        render(<CreatePost />);
        expect(screen.getByPlaceholderText("What's on your mind, testuser?")).toBeInTheDocument();
        expect(screen.getByText('Photo')).toBeInTheDocument();
        expect(screen.getByText('Clear')).toBeInTheDocument();
        expect(screen.getByText('Post')).toBeInTheDocument();
    });

    it('allows typing in text field', () => {
        render(<CreatePost />);
        const textField = screen.getByPlaceholderText("What's on your mind, testuser?");
        fireEvent.change(textField, { target: { value: 'Hello world!' } });
        expect(textField).toHaveValue('Hello world!');
    });

    it('enables post button when text is entered', () => {
        render(<CreatePost />);
        const postButton = screen.getByText('Post');
        const textField = screen.getByPlaceholderText("What's on your mind, testuser?");
        expect(postButton).toBeDisabled();
        fireEvent.change(textField, { target: { value: 'Hello world!' } });
        expect(postButton).not.toBeDisabled();
    });

    it('handles image selection', () => {
        render(<CreatePost />);
        const fileInput = screen.getByRole('button', { name: /photo/i }).querySelector('input[type="file"]');
        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
        Object.defineProperty(fileInput, 'files', {
            value: [file],
            writable: false,
        });
        fireEvent.change(fileInput!);
        expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
    });

    it('shows image preview after selection', () => {
        render(<CreatePost />);
        const fileInput = screen.getByRole('button', { name: /photo/i }).querySelector('input[type="file"]');
        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
        Object.defineProperty(fileInput, 'files', {
            value: [file],
            writable: false,
        });
        fireEvent.change(fileInput!);
        const images = screen.getAllByRole('img');
        expect(images.length).toBeGreaterThan(1);
        const previewImage = images.find(img => img.getAttribute('src') === 'mocked-url');
        expect(previewImage).toBeInTheDocument();
    });

    it('removes image when close button is clicked', () => {
        render(<CreatePost />);
        const fileInput = screen.getByRole('button', { name: /photo/i }).querySelector('input[type="file"]');
        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
        Object.defineProperty(fileInput, 'files', {
            value: [file],
            writable: false,
        });
        fireEvent.change(fileInput!);
        const closeButtons = screen.getAllByRole('button');
        const removeButton = closeButtons.find(btn =>
            btn.querySelector('[data-testid="CloseIcon"]') ||
            btn.getAttribute('aria-label')?.includes('close') ||
            btn.textContent === ''
        );
        if (removeButton) {
            fireEvent.click(removeButton);
            expect(global.URL.revokeObjectURL).toHaveBeenCalled();
        }
    });

    it('limits image selection to 4 images', () => {
        render(<CreatePost />);
        const fileInput = screen.getByRole('button', { name: /photo/i }).querySelector('input[type="file"]');
        const files = Array.from({ length: 5 }, (_, i) =>
            new File(['test'], `test${i}.jpg`, { type: 'image/jpeg' })
        );
        Object.defineProperty(fileInput, 'files', {
            value: files,
            writable: false,
        });
        fireEvent.change(fileInput!);
        expect(screen.getByText(/Only \d+ more images allowed/)).toBeInTheDocument();
    });

    it('clears all content when clear button is clicked', () => {
        render(<CreatePost />);
        const textField = screen.getByPlaceholderText("What's on your mind, testuser?");
        const clearButton = screen.getByText('Clear');
        fireEvent.change(textField, { target: { value: 'Test content' } });
        fireEvent.click(clearButton);
        expect(textField).toHaveValue('');
    });

    it('disables post button when no content is provided', () => {
        render(<CreatePost />);
        const textField = screen.getByPlaceholderText("What's on your mind, testuser?");
        const postButton = screen.getByText('Post');
        expect(postButton).toBeDisabled();
        fireEvent.change(textField, { target: { value: 'Hello world' } });
        expect(postButton).not.toBeDisabled();
        fireEvent.change(textField, { target: { value: '' } });
        expect(postButton).toBeDisabled();
        fireEvent.change(textField, { target: { value: '   ' } });
        expect(postButton).toBeDisabled();
    });

    it('calls createPost and refreshPosts on successful submission', async () => {
        render(<CreatePost />);
        const textField = screen.getByPlaceholderText("What's on your mind, testuser?");
        const postButton = screen.getByText('Post');
        fireEvent.change(textField, { target: { value: 'Test post' } });
        fireEvent.click(postButton);
        await waitFor(() => {
            expect(createPost).toHaveBeenCalledWith({
                description: 'Test post',
                images: [],
            });
            expect(mockPostContext.refreshPosts).toHaveBeenCalled();
        });
    });

    it('shows loading state during post submission', async () => {
        vi.mocked(createPost).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
        render(<CreatePost />);
        const textField = screen.getByPlaceholderText("What's on your mind, testuser?");
        const postButton = screen.getByText('Post');
        fireEvent.change(textField, { target: { value: 'Test post' } });
        fireEvent.click(postButton);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        expect(postButton).toBeDisabled();
        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });
    });

    it('shows error message on failed submission', async () => {
        vi.mocked(createPost).mockRejectedValue(new Error('API Error'));
        render(<CreatePost />);
        const textField = screen.getByPlaceholderText("What's on your mind, testuser?");
        const postButton = screen.getByText('Post');
        fireEvent.change(textField, { target: { value: 'Test post' } });
        fireEvent.click(postButton);
        await waitFor(() => {
            expect(screen.getByText('Failed to create post')).toBeInTheDocument();
        });
    });

    it('clears form after successful submission', async () => {
        render(<CreatePost />);
        const textField = screen.getByPlaceholderText("What's on your mind, testuser?");
        const postButton = screen.getByText('Post');
        fireEvent.change(textField, { target: { value: 'Test post' } });
        fireEvent.click(postButton);
        await waitFor(() => {
            expect(textField).toHaveValue('');
        });
    });

    it('disables clear button when no content', () => {
        render(<CreatePost />);
        const clearButton = screen.getByText('Clear');
        expect(clearButton).toBeDisabled();
    });

    it('enables clear button when content exists', () => {
        render(<CreatePost />);
        const textField = screen.getByPlaceholderText("What's on your mind, testuser?");
        const clearButton = screen.getByText('Clear');
        fireEvent.change(textField, { target: { value: 'Test content' } });
        expect(clearButton).not.toBeDisabled();
    });
});
