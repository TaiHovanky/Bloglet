import React from 'react';
import { Card, CardContent, Container, makeStyles, Typography } from '@material-ui/core';
import { GetUserPostsQuery } from '../generated/graphql';

interface Props {
  posts: GetUserPostsQuery['getUserPosts']
}

const useStyles = makeStyles({
  root: {
    minWidth: 400,
    marginTop: 30
  },
  post: {
    marginBottom: 12,
  },
});

const Posts: React.FC<Props> = (props: any) => {
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
          </CardContent>
        </Card>
      ))}
    </Container>
  )
};

export default Posts;