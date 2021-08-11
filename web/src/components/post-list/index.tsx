import React from 'react';
import { Button, Card, CardContent, Container, Divider, Grid, makeStyles, Typography } from '@material-ui/core';
import { GetUserPostsQuery, Post } from '../../generated/graphql';

interface Props {
  posts: GetUserPostsQuery['getUserPosts'],
  likePost: (userId: number, post: Post) => void,
  user: any
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
  }
});

const PostList: React.FC<Props> = (props: any) => {
  const classes = useStyles();

  return (
    <Container maxWidth="sm">
      {props.posts.map((post: any) => (
        <Card className={classes.root} variant="outlined" key={post.id}>
          <CardContent>
            <Typography variant="h5" component="h2">
              {post.title}
            </Typography>
            <Typography className={classes.post} color="textSecondary">
              {post.body}
            </Typography>
            <Divider variant="middle" className={classes.divider} />
            <Grid container spacing={3}>
              <Grid item xs={2}>
                <Button variant="contained" color="primary" onClick={() => props.likePost(props.user.id, post)}>Like</Button>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="h6" color="textSecondary">{post.likes.length}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Container>
  )
};

export default PostList;