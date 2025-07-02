import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Switch,
  FormControlLabel,
  Avatar,
  Typography,
  Chip,
  Collapse,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useAuth } from "../../auth/useAuth";

interface CommentInputProps {
  onCommentSubmit: (comment: string, askAI: boolean) => Promise<void>;
  isLoading?: boolean;
}

const CommentInput: React.FC<CommentInputProps> = ({ onCommentSubmit, isLoading = false }) => {
  const [comment, setComment] = useState("");
  const [askAI, setAskAI] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const {user} = useAuth();
  
  const MAX_COMMENT_LENGTH = 500;
  const hasContent = comment.length > 0;

  const handleSubmit = async () => {
    if (!comment.trim() || isLoading) return;
    
    try {
      await onCommentSubmit(comment.trim(), askAI);
      setComment("");
      setAskAI(false);
      setIsFocused(false);
    } catch (error) {
      // Error is already handled in parent component
      console.error('Comment submission failed:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && comment.trim() && !isLoading) {
      handleSubmit();
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_COMMENT_LENGTH) {
      setComment(value);
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 600,
        margin: 'auto',
        mb: 2,
        borderRadius: '8px',
        boxShadow: isFocused 
          ? '0 2px 8px rgba(0,0,0,0.15)' 
          : '0 1px 3px rgba(0,0,0,0.12)',
        border: '1px solid rgba(0,0,0,0.12)',
        transition: 'all 0.2s ease',
        backgroundColor: '#ffffff',
        opacity: isLoading ? 0.7 : 1,
        '&:hover': {
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Avatar 
            src={user?.profilePicture}
            sx={{ 
              width: 40, 
              height: 40,
              backgroundColor: '#e0e0e0',
              color: '#757575'
            }}
          >
            <AccountCircleIcon />
          </Avatar>
          
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary', 
                mb: 1.5,
                fontWeight: 500
              }}
            >
              Share your thoughts...
            </Typography>
            
            <TextField
              multiline
              fullWidth
              minRows={hasContent || isFocused ? 3 : 1}
              maxRows={6}
              placeholder="What's on your mind?"
              variant="outlined"
              value={comment}
              onChange={handleCommentChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              helperText={hasContent ? `${comment.length}/${MAX_COMMENT_LENGTH} characters` : undefined}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#f8f9fa',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#ffffff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1976d2',
                      borderWidth: '1px', 
                    }
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0,0,0,0.15)',
                    borderWidth: '1px', 
                  }
                },
                '& .MuiInputBase-input': {
                  fontSize: '14px',
                  lineHeight: 1.5,
                },
                '& .MuiFormHelperText-root': {
                  fontSize: '12px',
                  color: comment.length > MAX_COMMENT_LENGTH * 0.9 ? '#d32f2f' : 'text.secondary',
                }
              }}
            />
          </Box>
        </Box>

        <Collapse in={hasContent} timeout={300}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: 2,
              pt: 2,
              borderTop: '1px solid rgba(0,0,0,0.08)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={askAI}
                    onChange={() => setAskAI((prev) => !prev)}
                    size="small"
                    color="primary"
                    disabled={isLoading}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Request AI Reply
                  </Typography>
                }
              />
              
              {askAI && (
                <Chip
                  label="AI will respond to your comment"
                  size="small"
                  variant="outlined"
                  sx={{ 
                    fontSize: '11px',
                    height: '24px',
                    borderRadius: '12px',
                    borderColor: 'primary.main',
                    color: 'primary.main'
                  }}
                />
              )}
            </Box>

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!comment.trim() || isLoading}
              sx={{
                minWidth: 'auto',
                width: 40,
                height: 40,
                borderRadius: '50%',
                p: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: comment.trim() && !isLoading ? 'primary.main' : undefined,
                '&:hover': {
                  backgroundColor: comment.trim() && !isLoading ? 'primary.dark' : undefined,
                },
                '&:disabled': {
                  backgroundColor: 'rgba(0,0,0,0.12)',
                  color: 'rgba(0,0,0,0.26)',
                }
              }}
            >
              {isLoading ? (
                <CircularProgress size={18} sx={{ color: 'white' }} />
              ) : (
                <ArrowUpwardIcon sx={{ fontSize: 18 }} />
              )}
            </Button>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default CommentInput;
