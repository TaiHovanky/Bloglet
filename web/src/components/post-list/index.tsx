import React, { useState } from 'react';
import { Card, CardContent, Container, Grid, IconButton, makeStyles, Typography } from '@material-ui/core';
import { CommentOutlined } from '@material-ui/icons';
import CommentListContainer from '../../containers/comment-list-container';
import CommentInputContainer from '../../containers/comment-input-container';
import { GetUserPostsQuery, User } from '../../generated/graphql';
import LikeButtonContainer from '../../containers/like-button-container';

interface Props {
  posts: GetUserPostsQuery['getUserPosts'],
  likePost: any,
  handlePostCreatorClick: (user: User) => void
}

const useStyles = makeStyles({
  root: {
    minWidth: 400,
    marginTop: 30
  },
  postCreator: {
    cursor: 'pointer'
  },
  post: {
    marginBottom: 12,
  },
  inline: {
    display: 'inline',
  },
  likes: {
    marginBottom: 4
  }
});

const PostList: React.FC<Props> = ({
  posts,
  likePost,
  handlePostCreatorClick
}: Props) => {
  const classes = useStyles();

  const [showCommentInput, setShowCommentInput] = useState(false);

  const handleShowCommentInput = (): void => {
    if (!showCommentInput) {
      setShowCommentInput(true);
    }
  };

  return (
    <Container maxWidth="sm">
      {!!posts ? posts.map((post: any) => (
        <Card className={classes.root} variant="outlined" key={post.id}>
          <CardContent>
            <div className={classes.post}>
              <span onClick={() => handlePostCreatorClick(post.user)} className={classes.postCreator}>
                <Typography
                  component="span"
                  variant="subtitle2"
                  className={classes.inline}
                  color="textPrimary"
                >
                  {post && post.user ? `${post.user.firstName} ${post.user.lastName} ` : ''}
                </Typography>
              </span>
              <Typography variant="caption" className={classes.inline}>
                {new Date(post.createdAt).toLocaleString()}
              </Typography>
            </div>
            <div className={classes.post}>
              <Typography variant="subtitle1">
                {post.content}
              </Typography>
            </div>
            <Grid container spacing={3} className={classes.likes}>
              <Grid item xs={1}>
                <LikeButtonContainer item={post} likeMutation={likePost} />
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
            {showCommentInput && <CommentInputContainer postId={post.id} />}
            <CommentListContainer comments={post.comments} />
          </CardContent>
        </Card>
      )) : []}
    </Container>
  );
};

export default PostList;