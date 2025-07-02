import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Photo, Close } from '@mui/icons-material';
import { createPost } from '../../api/post';
import { useAuth } from '../../auth/useAuth';
import { usePost } from '../../post/PostContext';

const CreatePost = () => {
  const [text, setText] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {user} = useAuth();
  const { refreshPosts } = usePost();

  const currentUser = {
    name: user?.username || "Sir",
    avatar: user?.profilePicture,
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remaining = 4 - selectedImages.length;
    const filesToAdd = files.slice(0, remaining);

    if (filesToAdd.length < files.length) {
      setError(`Only ${remaining} more images allowed`);
      setTimeout(() => setError(null), 3000);
    }

    setSelectedImages(prev => [...prev, ...filesToAdd]);
    setPreviewUrls(prev => [
      ...prev,
      ...filesToAdd.map(file => URL.createObjectURL(file)),
    ]);
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setText('');
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setSelectedImages([]);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!text.trim() && !selectedImages.length) {
      setError('Add some text or image to post');
      return;
    }
    try {
      setLoading(true);
      setError(null);

      await createPost({ description: text.trim(), images: selectedImages });

      clearAll();
      await refreshPosts();
    } catch {
      setError('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => previewUrls.forEach(url => URL.revokeObjectURL(url));
  });

  const isFormValid = text.trim() || selectedImages.length > 0;

  return (
    <Card
      sx={{
        maxWidth: 600,
        margin: 'auto',
        mb: 1,
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        border: '1px solid rgba(0,0,0,0.12)',
      }}
    >
      <CardContent>
        {/* Top Section */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={currentUser.avatar} />
          <TextField
            fullWidth
            multiline
            minRows={2}
            maxRows={12}
            placeholder={`What's on your mind, ${currentUser.name.split(' ')[0]}?`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '30px',
                bgcolor: '#f0f2f5',
                '& fieldset': { border: 'none' },
                '&:hover': { bgcolor: '#e4e6eb' },
                '&.Mui-focused': { bgcolor: '#fff' },
              },
            }}
          />
        </Stack>

        {error && (
          <Alert
            severity="error"
            sx={{ mt: 2 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Image Previews */}
        {previewUrls.length > 0 && (
          <Grid container spacing={1} sx={{ mt: 2 }}>
            {previewUrls.map((url, index) => (
              <Grid container spacing={2} key={index}>
                <Box sx={{ position: 'relative' }}>
                  <Box
                    component="img"
                    src={url}
                    sx={{
                      width: '100%',
                      height: 100,
                      borderRadius: 2,
                      objectFit: 'cover',
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => removeImage(index)}
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      bgcolor: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Bottom Section */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            component="label"
            startIcon={<Photo />}
            sx={{
              textTransform: 'none',
              color: '#45bd62',
              bgcolor: '#f0f2f5',
              borderRadius: 2,
              '&:hover': { bgcolor: '#e4e6eb' },
            }}
          >
            Photo
            <input
              type="file"
              hidden
              accept="image/*"
              multiple
              onChange={handleImageChange}
              disabled={selectedImages.length >= 4}
            />
          </Button>

          <Stack direction="row" spacing={1}>
            <Button
              onClick={clearAll}
              disabled={loading || (!text && selectedImages.length === 0)}
              sx={{
                textTransform: 'none',
                borderRadius: '20px',
                bgcolor: '#f0f2f5',
                '&:hover': { bgcolor: '#e4e6eb' },
              }}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={18} /> : null}
              onClick={handleSubmit}
              disabled={loading || !isFormValid}
              sx={{
                borderRadius: '20px',
                px: 3,
                textTransform: 'none',
                bgcolor: '#1877f2',
                '&:hover': { bgcolor: '#166fe5' },
                '&:disabled': { bgcolor: 'grey.400' },
              }}
            >
              Post
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
