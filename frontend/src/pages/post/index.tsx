import { useParams } from 'react-router-dom';
import PostCard from '../../components/post/card';
import { usePost } from '../../post/PostContext';
import CommentSection from '../../components/comments';
import { useEffect, useState } from 'react';
import PostCardSkeleton from '../../components/skeletons/postCard';

const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getPostById, posts } = usePost();
  const [loading, setLoading] = useState<boolean>(false);
  
  const post = posts.find((p) => p._id === id);
  
  useEffect(() => {
    const fetchPost = async () => {
      if (!post && id) {
        setLoading(true);
        try {
          await getPostById(id);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchPost();
  }, [id, post, getPostById]);

  if (loading) {
    return <PostCardSkeleton />;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div>
      <PostCard post={post} />
      <CommentSection postId={post._id} />
    </div>
  );
};

export default PostPage;
