import { Avatar, Card, CardContent, CardHeader, Skeleton, IconButton, Paper } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const CommentSkeleton = () => {
  return (
    <Card
      sx={{
        maxWidth: 600,
        margin: "auto",
        mb: 1,
        border: "1px solid rgba(0,0,0,0.1)",
        borderRadius: "8px",
        boxShadow: "none",
      }}
    >
      <CardHeader
        avatar={<Skeleton variant="circular"><Avatar /></Skeleton>}
        action={
          <IconButton disabled>
            <MoreVertIcon />
          </IconButton>
        }
        title={<Skeleton variant="text" width="40%" />}
        subheader={<Skeleton variant="text" width="30%" />}
      />
      <CardContent>
        <Skeleton variant="rectangular" width="100%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="rectangular" width="90%" height={20} sx={{ mb: 1 }} />

        <Paper
          variant="outlined"
          sx={{
            p: 1.5,
            mt: 1.5,
            backgroundColor: "rgba(0,0,0,0.03)",
            borderRadius: "8px",
            borderLeft: "4px solid #1976d2",
          }}
        >
          <Skeleton variant="text" width="30%" sx={{ mb: 0.5 }} />
          <Skeleton variant="rectangular" width="100%" height={20} />
        </Paper>
      </CardContent>
    </Card>
  );
};

export default CommentSkeleton;
