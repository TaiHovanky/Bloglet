import React, { useEffect } from 'react';
import { Container, makeStyles, Typography } from '@material-ui/core';
import { useQuery } from '@apollo/client';
import {
  useCreatePostMutation,
  useHomePageLazyQuery,
  useGetUserPostsQuery,
  useLikePostMutation,
  Post,
  UserLikesPosts,
  useGetFollowingQuery,
  useGetFollowersQuery
} from '../../generated/graphql';
import { currentUserProfileVar } from '../../cache';
import NewPostForm from '../../components/new-post-form';
import PostList from '../../components/post-list';
import SplashPage from '../../components/splash-page';
import PrimaryAppBar from '../../components/primary-app-bar';
import getCurrentUserProfile from '../../cache-queries/current-user-profile';
import FollowButton from '../../components/follow-button';
import UserFollows from '../../components/user-follows';

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

  // eslint-disable-next-line
  const currentUserProfile = useQuery(getCurrentUserProfile);

  const { data: postsData, loading: postsLoading, refetch } = useGetUserPostsQuery({
    variables: { userId: currentUserProfileVar().id },
    skip: !currentUserProfileVar().id,
    onError: (err) => console.log(err)
  });

  const { data: followingData, loading: followingLoading } = useGetFollowingQuery({
    variables: { userId: currentUserProfileVar().id }
  });

  const { data: followerData, loading: followerLoading, refetch: refetchFollowers } = useGetFollowersQuery({
    variables: { userId: currentUserProfileVar().id }
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
              <Typography variant="h3">
                {`${currentUserProfileVar().firstName} ${currentUserProfileVar().lastName}`}
              </Typography>
              <FollowButton
                followers={followerData}
                loggedInUser={userData.homePage.id}
                refetchFollowers={refetchFollowers}
                userToBeFollowed={currentUserProfileVar().id}
              />
              <UserFollows
                followers={followerData}
                following={followingData}
                followerLoading={followerLoading}
                followingLoading={followingLoading}
              />
            </>
            {currentUserProfileVar().id === userData.homePage.id && <NewPostForm handleSubmit={handleSubmit} />}
            {postsData && postsData.getUserPosts &&
              <PostList
                posts={postsData?.getUserPosts}
                likePost={handleLikePost}
                user={userData.homePage}
              />
            }
          </Container>
        </> :
        <SplashPage />
      }
    </div>
  );
}

export default Home;