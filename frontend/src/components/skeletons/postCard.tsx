import { Card, CardHeader, CardContent, Skeleton, CardActions, Avatar } from "@mui/material";

const PostCardSkeleton = () => {
  return (
    <Card sx={{ maxWidth: 600, margin: "auto", mb: 4 }}>
      <CardHeader
        avatar={
          <Skeleton variant="circular">
            <Avatar />
          </Skeleton>
        }
        title={<Skeleton width="40%" />}
        subheader={<Skeleton width="30%" />}
      />

      <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2, mx: 2 }} />

      <CardContent>
        <Skeleton width="80%" />
        <Skeleton width="60%" />
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2 }}>
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="circular" width={32} height={32} />
      </CardActions>
    </Card>
  );
};

export default PostCardSkeleton;
