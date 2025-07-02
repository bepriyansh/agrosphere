import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import type { IComment } from "../../api/types";
import CommentCard from "./commentCard";
import { deleteComment, getComments } from "../../api/post";
import CommentSkeleton from "../skeletons/commentCard";

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [deletingComments, setDeletingComments] = useState<Set<string>>(new Set());

  const mergeUniquePosts = (arr1: IComment[], arr2: IComment[]) => {
    const map = new Map();
    [...arr1, ...arr2].forEach((post) => {
      map.set(post._id, post);
    });
    return Array.from(map.values());
  };

  const fetchComments = async () => {
    try {
      const data = await getComments(postId, page);

      setComments((prev) => mergeUniquePosts(prev, data.items));

      if (data.currentPage >= data.totalPages) {
        setHasMore(false);
      } else {
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  useEffect(() => {
    // Reset when postId changes
    setComments([]);
    setPage(1);
    setHasMore(true);
    setDeletingComments(new Set());
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const handleDeleteComment = async (commentId: string) => {
    setDeletingComments((prev) => new Set(prev).add(commentId));

    try {
      await deleteComment(commentId);

      setComments((prev) => prev.filter(comment => comment._id !== commentId));
      
    } catch (error) {
      console.error('Failed to delete comment:', error);
    } finally {
      setDeletingComments((prev) => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  };

  return (
    <Box>
      <InfiniteScroll
        dataLength={comments.length}
        next={fetchComments}
        hasMore={hasMore}
        loader={<CommentSkeleton />} 
        endMessage={
          comments.length > 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              mt={1}
            >
              No more comments.
            </Typography>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              mt={1}
            >
              No comments yet. Be the first to comment.
            </Typography>
          )
        }
      >
        {comments.map((comment) => (
          <CommentCard 
            key={comment._id} 
            comment={comment} 
            onDelete={handleDeleteComment} 
            isDeleting={deletingComments.has(comment._id)}
          />
        ))}
      </InfiniteScroll>
    </Box>
  );
};

export default CommentSection;
