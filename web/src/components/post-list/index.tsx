import React from 'react';
import { Card, CardContent, Container, Divider, Grid, makeStyles, Typography } from '@material-ui/core';
import { GetUserPostsQuery } from '../../generated/graphql';
import LikeButton from '../like-button';
import CommentList from '../comment-list';
import CommentInput from '../comment-input';

interface Props {
  posts: GetUserPostsQuery['getUserPosts'],
  likePost: any,
  likeComment: any,
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
  divider: {
    marginBottom: 16
  },
  likes: {
    marginBottom: 4
  }
});

const PostList: React.FC<Props> = ({ likePost, likeComment, posts, userId }: Props) => {
  const classes = useStyles();

  return (
    <Container maxWidth="sm">
      {!!posts ? posts.map((post: any) => (
        <Card className={classes.root} variant="outlined" key={post.id}>
          <CardContent>
            <Typography variant="h5" component="h2">
              {post.title}
            </Typography>
            <Typography className={classes.post} color="textSecondary">
              {post.body}
            </Typography>
            <Divider variant="middle" className={classes.divider} />
            <Grid container spacing={3} className={classes.likes}>
              <Grid item xs={2}>
                <LikeButton userId={userId} item={post} likeMutation={likePost} />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="h6" color="textSecondary">{post.likes.length}</Typography>
              </Grid>
            </Grid>
            <Divider variant="middle" className={classes.divider} />
            <CommentInput userId={userId} postId={post.id} />
            <Divider variant="middle" className={classes.divider} />
            <CommentList comments={post.comments} userId={userId} likeComment={likeComment} />
          </CardContent>
        </Card>
      )) : []}
    </Container>
  )
};

export default PostList;