import React, { useState } from 'react';
import CommentListContainer from '../../containers/comment-list-container';
import LikeButton from '../like-button';
import CommentInputContainer from '../../containers/comment-input-container';
import { Card, CardContent, Grid, IconButton, makeStyles, Typography } from '@material-ui/core';
import { CommentOutlined } from '@material-ui/icons';

interface Props {
  post: any,
  likePost: any,
  userId: number
}

const useStyles = makeStyles({
  root: {
    minWidth: 400,
    marginTop: 30
  },
  post: {
    marginBottom: 12,
  },
  likes: {
    marginBottom: 4
  }
});

const Post: React.FC<Props> = ({
  post,
  userId,
  likePost,
}: Props) => {
  const classes = useStyles();

  const [showCommentInput, setShowCommentInput] = useState(false);

  const handleShowCommentInput = (): void => {
    if (!showCommentInput) {
      setShowCommentInput(true);
    }
  };

  return (
    <Card className={classes.root} variant="outlined" key={post.id}>
      <CardContent>
        <div className={classes.post}>
          <Typography variant="subtitle1">
            {post.content}
          </Typography>
          <Typography variant="caption">
            {new Date(post.createdAt).toLocaleString()}
          </Typography>
        </div>
        <Grid container spacing={3} className={classes.likes}>
          <Grid item xs={1}>
            <LikeButton userId={userId} item={post} likeMutation={likePost} />
          </Grid>
          <Grid item xs={2}>
            <Typography variant="subtitle1" color="textSecondary">{post.likes.length}</Typography>
          </Grid>
          <Grid item xs={1}>
            <IconButton size="small" onClick={handleShowCommentInput}>
              <CommentOutlined />
            </IconButton>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="subtitle1" color="textSecondary">{post.comments.length}</Typography>
          </Grid>
        </Grid>
        {showCommentInput && <CommentInputContainer userId={userId} postId={post.id} />}
        <CommentListContainer comments={post.comments} />
      </CardContent>
    </Card>
  );
};

export default Post;