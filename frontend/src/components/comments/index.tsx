import { Box } from "@mui/material";
import { useState } from "react";
import CommentSection from "./commentSection";
import CommentInput from "./commentInput";
import { addComment } from "../../api/post";

interface CommentsProps {
  postId: string;
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCommentSubmit = async (comment: string, askAI: boolean) => {
    try {
      setIsLoading(true);
      await addComment({ postId, description: comment, askAI });
      // Trigger refresh of comments by updating the key
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Failed to post comment:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      <CommentInput 
        onCommentSubmit={handleCommentSubmit} 
        isLoading={isLoading}
      />
      <CommentSection 
        postId={postId} 
        key={refreshKey}
      />
    </Box>
  );
};

export default Comments;
