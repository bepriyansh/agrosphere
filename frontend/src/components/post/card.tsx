import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  Avatar,
  IconButton,
  Typography,
  CardActions,
  Box,
  Menu,
  MenuItem,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import PostCarousel from './carousel';
import type { IPost } from '../../api/types';
import { timeAgo } from '../../utils/timeAgo';
import { useNavigate } from 'react-router-dom';
import { usePost } from '../../post/PostContext';
import { useAuth } from '../../auth/useAuth';
import FormattedText from '../FormattedText';

interface PostCardProps {
  post: IPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const navigate = useNavigate();
  const { toggleLike, likingPosts, deletePost, deletingPosts } = usePost();
  const { user } = useAuth();
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const isOwner = user?.id === post.user.id;
  const isLiking = likingPosts.has(post._id);
  const isDeleting = deletingPosts.has(post._id);

  const handleLike = () => {
    toggleLike(post._id);
  };

  const handleComment = () => {
    navigate(`/post/${post._id}`);
  };

  const handleShare = () => {
    console.log('Share post', post._id);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    try {
      handleMenuClose();
      await deletePost(post._id);
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  return (
    <>
      <Card sx={{ 
          maxWidth: 600, 
          margin: 'auto', 
          mb: 1, 
          borderRadius: '8px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          border: '1px solid rgba(0,0,0,0.12)',
          position: 'relative',
          opacity: isDeleting ? 0.4 : 1,
          transition: 'opacity 0.3s ease',
          pointerEvents: isDeleting ? 'none' : 'auto'
        }}>
        
        {isDeleting && (
          <Backdrop
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            open={isDeleting}
          >
            <CircularProgress 
              size={50} 
              thickness={4}
              sx={{ 
                color: '#1976d2',
                mb: 2
              }} 
            />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: '#333',
                mb: 1
              }}
            >
              Deleting Post
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#666',
                textAlign: 'center'
              }}
            >
              Please wait...
            </Typography>
          </Backdrop>
        )}

        <CardHeader
          avatar={<Avatar src={post.user.profilePicture} />}
          action={isOwner && (
            <IconButton
              aria-label="more-options"
              onClick={handleMenuClick}
              disabled={isDeleting}
            >
              <MoreVertIcon />
            </IconButton>
          )}
          title={post.user.username}
          subheader={timeAgo(post.createdAt)}
        />
        
        {isOwner && (
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleDelete} disabled={isDeleting}>
              <DeleteIcon sx={{ mr: 1 }} />
              Delete Post
            </MenuItem>
          </Menu>
        )}

        {post.images.length > 0 && (
          <CardMedia>
            <PostCarousel images={post.images} />
          </CardMedia>
        )}
        
        <CardContent>
          <FormattedText 
            text={post.description} 
            color="text.primary"
          />
        </CardContent>
        
        <CardActions disableSpacing>
          <IconButton
            aria-label="like"
            onClick={handleLike}
            color={post.isLiked ? 'error' : 'default'}
            disabled={isLiking || isDeleting}
          >
            {post.isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography variant="body2">{post.totalLikes}</Typography>
          
          <IconButton
            aria-label="comment"
            onClick={handleComment}
            disabled={isDeleting}
          >
            <ChatBubbleOutlineIcon />
          </IconButton>
          <Typography variant="body2">{post.totalComments}</Typography>
          
          <Box flexGrow={1} />
          
          <IconButton
            aria-label="share"
            onClick={handleShare}
            disabled={isDeleting}
          >
            <ShareIcon />
          </IconButton>
        </CardActions>
      </Card>
    </>
  );
};

export default PostCard;
