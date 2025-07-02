import { createContext, useContext, useState, type ReactNode } from "react";
import { getFeed, likePost, deletePost as deletePostApi } from "../api/post";
import type { FeedResponse, IPost } from "../api/types";
import { getPostById as getPostFromServer } from "../api/post"

interface PostContextType {
  posts: IPost[];
  fetchPosts: () => Promise<void>;
  refreshPosts: () => Promise<void>;
  hasMore: boolean;
  toggleLike: (id: string) => Promise<void>;
  getPostById: (id: string) => Promise<IPost | undefined>;
  deletePost: (id: string) => Promise<void>;
  likingPosts: Set<string>;
  deletingPosts: Set<string>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set());
  const [deletingPosts, setDeletingPosts] = useState<Set<string>>(new Set());

  const mergeUniquePosts = (arr1: IPost[], arr2: IPost[]) => {
    const map = new Map();
    [...arr1, ...arr2].forEach((post) => {
      map.set(post._id, post);
    });
    return Array.from(map.values());
  };

  const fetchPosts = async () => {
    try {
      const data: FeedResponse = await getFeed(page);
      setPosts((prev) => mergeUniquePosts(prev, data.items));

      if (data.currentPage >= data.totalPages) {
        setHasMore(false);
      } else {
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  const refreshPosts = async () => {
    try {
      setPage(1);
      setHasMore(true);
      setPosts([]); 
      
      const data: FeedResponse = await getFeed(1);
      setPosts(data.items);

      if (data.currentPage >= data.totalPages) {
        setHasMore(false);
        setPage(1);
      } else {
        setPage(2); 
      }
    } catch (error) {
      console.error("Failed to refresh posts:", error);
    }
  };

  const toggleLike = async (id: string) => {
    const previousPosts = posts;
    setLikingPosts((prev) => new Set(prev).add(id));

    setPosts((prev) =>
      prev.map((post) =>
        post._id === id
          ? {
              ...post,
              isLiked: !post.isLiked,
              totalLikes: post.isLiked
                ? post.totalLikes - 1
                : post.totalLikes + 1,
            }
          : post
      )
    );

    try {
      await likePost(id);
    } catch (error) {
      console.error("Failed to like post:", error);
      setPosts(previousPosts);
    } finally {
      setLikingPosts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const deletePost = async (id: string) => {
    setDeletingPosts((prev) => new Set(prev).add(id));

    try {
      await deletePostApi(id);
      setPosts((prev) => prev.filter((post) => post._id !== id));
    } catch (error) {
      console.error("Failed to delete post:", error);
      throw error; // Re-throw to handle in UI
    } finally {
      setDeletingPosts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const getPostById = async (id: string): Promise<IPost | undefined> => {
    const post = posts.find((p) => p._id === id);
    
    if (post) return post;

    try {
      const fetchedPost = await getPostFromServer(id);
      setPosts((prev) => [...prev, fetchedPost]);
      return fetchedPost;
    } catch (error) {
      console.error("Failed to fetch post by ID:", error);
      return undefined;
    }
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        fetchPosts,
        refreshPosts,
        hasMore,
        toggleLike,
        getPostById,
        deletePost,
        likingPosts,
        deletingPosts,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePost must be used within a PostProvider");
  }
  return context;
};
