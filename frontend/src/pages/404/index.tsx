import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

export default function NotFoundMascot() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height:"90vh",
        p: 2,
      }}
    >
      <Paper
        elevation={5}
        sx={{
          p: 5,
          borderRadius: 4,
          textAlign: 'center',
          bgcolor: '#fff',
        }}
      >
        <SentimentVeryDissatisfiedIcon sx={{ fontSize: 90, color: 'error.main', mb: 2 }} />
        <Typography variant="h3" sx={{ fontWeight: 700, color: 'error.main', mb: 1 }}>
          404
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
          Sorry, we couldn’t find that page.
        </Typography>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          color="error"
          sx={{ borderRadius: 2, px: 4 }}
        >
          Home
        </Button>
      </Paper>
    </Box>
  );
}
