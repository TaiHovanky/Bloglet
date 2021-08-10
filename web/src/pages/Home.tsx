import React, { useEffect } from 'react';
import { Container, makeStyles, Typography } from '@material-ui/core';
import { useQuery } from '@apollo/client';
import NewPostForm from '../components/new-post-form/NewPostForm';
import PostList from '../components/post-list/PostList';
import SplashPage from '../components/splash-page/SplashPage';
import {
  useCreatePostMutation,
  useHomePageLazyQuery,
  useGetUserPostsQuery,
  useLikePostMutation,
  Post,
  UserLikesPosts
} from '../generated/graphql';
import PrimaryAppBar from '../components/primary-app-bar/PrimaryAppBar';
import getCurrentUserProfile from '../cache-queries/current-user-profile';
import { currentUserProfileVar } from '../cache';
import FollowButton from '../components/follow-button/FollowButton';
import UserFollows from '../components/user-follows/UserFollows';

const useStyles = makeStyles(() => ({
  homePageContainer: {
    paddingTop: '1px',
    height: '100vh'
  }
}));

const Home: React.FC<any> = () => {
  const classes = useStyles();
  const [homePageQueryExecutor, { data: userData, loading }] = useHomePageLazyQuery({
    fetchPolicy: 'network-only',
    onCompleted: (data: any) => {
      if (data && data.homePage) {
        const {__typename, ...newUser} = data.homePage;
        currentUserProfileVar(newUser); /* this updates the local Apollo state in the cache for the currentUserProfileVar
        reactive variable. Instead of using routing to open a user profile, I'll be using local state to determine
        which user posts to display. In primaryAppBar, when a user is searched for and selected, currentUserProfileVar
        is updated, causing the useGetUserPostsQuery to call with a new userId. */
      }
    }
  });
  /* use the lazy query to prevent the "Can't perform a React state update on an unmounted component." error */

  const currentUserProfile = useQuery(getCurrentUserProfile);
  console.log('current user profile ', currentUserProfile);

  const { data: postsData, loading: postsLoading, refetch } = useGetUserPostsQuery({
    variables: { userId: currentUserProfileVar().id },
    skip: !currentUserProfileVar().id,
    onError: (err) => console.log(err)
  });

  const [createPost] = useCreatePostMutation();
  const [likePost] = useLikePostMutation();

  useEffect(
    () => {
      homePageQueryExecutor();
    },
    [homePageQueryExecutor]
  ); /* This calls the homePageQuery once to get the currently logged in user */

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

  const handleLikePost = (userId: number, post: Post) => {
    likePost({
      variables: {
        userId,
        postId: post.id
      },
      optimisticResponse: {
        likePost: [
          {
            __typename: 'Post',
            id: post.id,
            title: post.title,
            body: post.body,
            likes: [
              ...post.likes as Array<UserLikesPosts>,
              { __typename: 'UserLikesPosts', user: { __typename: 'User', id: userId }} as UserLikesPosts
            ]
          }
        ]
      }
    });
  }

  // const handleFollow = (userToBeFollowed: number, loggedInUser: number) => {
    
  // }

  if (loading || postsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={classes.homePageContainer}>
      {userData && userData.homePage ?
        <>
          <PrimaryAppBar user={userData.homePage} />
          <Container maxWidth="sm">
            <>
              <Typography variant="h3">{`${currentUserProfileVar().firstName} ${currentUserProfileVar().lastName}`}</Typography>
              <FollowButton loggedInUser={userData.homePage.id} userToBeFollowed={currentUserProfileVar().id} />
              <UserFollows userId={currentUserProfileVar().id} />
            </>
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