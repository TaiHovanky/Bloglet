import React from 'react';
import { Card, CardContent, Container, makeStyles, Typography } from '@material-ui/core';
import { GetUserPostsQuery } from '../generated/graphql';

interface Props {
  posts: GetUserPostsQuery['getUserPosts']
}

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
            <Typography className={classes.pos} color="textSecondary">
              {post.body}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  )
};

const useStyles = makeStyles({
  root: {
    minWidth: 400,
    marginTop: 30
  },
  pos: {
    marginBottom: 12,
  },
});

export default Posts;