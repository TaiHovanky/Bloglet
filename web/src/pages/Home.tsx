import React, { useEffect } from 'react';
import { Container, makeStyles, Paper, Typography } from '@material-ui/core';
import NewPost from '../components/NewPost';
import Posts from '../components/Posts';
import {
  useCreatePostMutation,
  useHomePageLazyQuery,
  useGetUserPostsQuery,
  useLikePostMutation
} from '../generated/graphql';
import PrimaryAppBar from '../components/PrimaryAppBar';

const useStyles = makeStyles((theme) => ({
  homePageContainer: {
    paddingTop: '1px',
    height: '100vh'
  },
  homePaper: {
    margin: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    paddingTop: theme.spacing(4)
  },
  homePageText: {
    marginTop: theme.spacing(4)
  }
}));

const Home: React.FC<any> = () => {
  const classes = useStyles();
  const [homePageQueryExecutor, { data: userData, loading }] = useHomePageLazyQuery({ fetchPolicy: 'network-only' });
  /* use the lazy query to prevent the "Can't perform a React state update on an unmounted component." error */

  const { data: postsData, loading: postsLoading, refetch } = useGetUserPostsQuery({
    variables: {
      userId: userData && userData.homePage && userData.homePage.id ? userData.homePage.id : 0
    },
    skip: !userData || !userData.homePage || !userData.homePage.id,
    onError: (err) => console.log(err)
  });

  const [createPost] = useCreatePostMutation();
  const [likePost] = useLikePostMutation();

  useEffect(
    () => {
      homePageQueryExecutor();
    },
    [homePageQueryExecutor]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    await createPost({
      variables: {
        creatorId: userData && userData.homePage ? userData.homePage.id : 0,
        title: formData.get('title') as string,
        body: formData.get('bodyText') as string
      }
    });
    refetch(); // is needed to refetch the posts query
  }

  const handleLikePost = (userId: number, postId: number) => {
    likePost({
      variables: {
        userId,
        postId
      }
    });
  }

  if (loading || postsLoading) {
    return <div>Loading...</div>;
  }

  if (userData && userData.homePage) {
    return (
      <div className={classes.homePageContainer}>
        <PrimaryAppBar user={userData.homePage} />
        <Container maxWidth="sm">
          <NewPost handleSubmit={handleSubmit} />
          {postsData && postsData.getUserPosts &&
            <Posts posts={postsData?.getUserPosts} likePost={handleLikePost} user={userData.homePage} />
          }
        </Container>
      </div>
    );
  }

  return (
    <div className={classes.homePageContainer}>
      <Paper elevation={3} className={classes.homePaper}>
        <Container maxWidth="md">
          <Typography className={classes.homePageText} variant="h3">Welcome to my practice social media app</Typography>
          <Typography className={classes.homePageText} variant="h5">Share your musings with the world through blog posts</Typography>
          <Typography className={classes.homePageText} variant="h5">To get started, register yourself as a user or login with an existing account</Typography>
        </Container>
      </Paper>
    </div>
  );
}

export default Home;