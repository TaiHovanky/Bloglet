import React, { useEffect } from 'react';
import { Container, makeStyles } from '@material-ui/core';
import NewPostForm from '../components/new-post-form/NewPostForm';
import PostList from '../components/post-list/PostList';
import SplashPage from '../components/splash-page/SplashPage';
import {
  useCreatePostMutation,
  useHomePageLazyQuery,
  useGetUserPostsQuery,
  useLikePostMutation
} from '../generated/graphql';
import PrimaryAppBar from '../components/primary-app-bar/PrimaryAppBar';

const useStyles = makeStyles((theme) => ({
  homePageContainer: {
    paddingTop: '1px',
    height: '100vh'
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

  return (
    <div className={classes.homePageContainer}>
      {userData && userData.homePage ?
        <>
          <PrimaryAppBar user={userData.homePage} />
          <Container maxWidth="sm">
            <NewPostForm handleSubmit={handleSubmit} />
            {postsData && postsData.getUserPosts &&
              <PostList posts={postsData?.getUserPosts} likePost={handleLikePost} user={userData.homePage} />
            }
          </Container>
        </> :
        <SplashPage />
      }
    </div>
  );
}

export default Home;