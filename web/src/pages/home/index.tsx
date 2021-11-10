import React, { useEffect } from 'react';
import { Container, makeStyles, Typography } from '@material-ui/core';
import { useQuery } from '@apollo/client';
import {
  useHomePageLazyQuery,
} from '../../generated/graphql';
import SplashPage from '../../components/splash-page';
import getCurrentUserProfile from '../../cache-queries/current-user-profile';
import getCurrentGetUserPostsCursor from '../../cache-queries/current-user-posts-cursor';
import { currentUserProfileVar } from '../../cache';
import UserFollowsContainer from '../../containers/user-follows-container';
import PostInputContainer from '../../containers/post-input-container';
import PostListContainer from '../../containers/post-list-container';
import PrimaryAppBarContainer from '../../containers/primary-app-bar-container';

const useStyles = makeStyles(() => ({
  homePageContainer: {
    minHeight: '100vh'
  },
  currentUserInfoContainer: {
    marginBottom: 30
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
  // eslint-disable-next-line
  const currentGetUserPostsCursor = useQuery(getCurrentGetUserPostsCursor);

  useEffect(
    () => {
      homePageQueryExecutor();
    },
    [homePageQueryExecutor]
  ); /* This calls the homePageQuery once to get the currently logged in user */

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={classes.homePageContainer}>
      {userData && userData.homePage ?
        <>
          <PrimaryAppBarContainer user={userData.homePage} />
          <Container maxWidth="sm">
            <div className={classes.currentUserInfoContainer}>
              <Typography variant="h4">
                {`${currentUserProfileVar().firstName} ${currentUserProfileVar().lastName}`}
              </Typography>
              <UserFollowsContainer
                loggedInUser={userData.homePage.id}
                userToBeFollowed={currentUserProfileVar().id}
              />
            </div>
            {currentUserProfileVar().id === userData.homePage.id &&
              <PostInputContainer userId={userData.homePage.id} />
            }
            <PostListContainer />
          </Container>
        </> :
        <SplashPage />
      }
    </div>
  );
}

export default Home;