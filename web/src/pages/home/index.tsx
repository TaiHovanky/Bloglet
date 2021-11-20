import React, { useEffect } from 'react';
import { Container, makeStyles, Typography } from '@material-ui/core';
import { useLazyQuery, useQuery } from '@apollo/client';
import {
  GetUserPostsDocument,
  useHomePageLazyQuery,
} from '../../generated/graphql';
import SplashPage from '../../components/splash-page';
import getCurrentUserProfile from '../../cache-queries/current-user-profile';
import getCurrentGetUserPostsCursor from '../../cache-queries/current-user-posts-cursor';
import { currentUserProfileVar, isSwitchingFromHomeToProfileVar, isSwitchingFromProfileToHomeVar, loggedInUserProfileVar } from '../../cache';
import UserFollowsContainer from '../../containers/user-follows-container';
import PostInputContainer from '../../containers/post-input-container';
import PostListContainer from '../../containers/post-list-container';
import getLoggedInUserProfile from '../../cache-queries/logged-in-user-profile';
import { RouteComponentProps } from 'react-router';
import { OFFSET_LIMIT } from '../../hooks/use-scroll.hook';
import getIsSwitchingFromHomeToProfile from '../../cache-queries/is-switching-from-home-to-profile';
import getIsSwitchingFromProfileToHome from '../../cache-queries/is-switching-from-profile-to-home';

const useStyles = makeStyles(() => ({
  homePageContainer: {
    minHeight: '100vh'
  },
  currentUserInfoContainer: {
    marginBottom: 30
  }
}));

const Home: React.FC<RouteComponentProps> = () => {
  const classes = useStyles();

  // eslint-disable-next-line
  const currentUserProfile = useQuery(getCurrentUserProfile);
  // eslint-disable-next-line
  const currentGetUserPostsCursor = useQuery(getCurrentGetUserPostsCursor);
  // eslint-disable-next-line
  const loggedInUserProfile = useQuery(getLoggedInUserProfile);
  // eslint-disable-next-line
  const isSwitchingFromHomeToProfile = useQuery(getIsSwitchingFromHomeToProfile);
  // eslint-disable-next-line
  const isSwitchingFromProfileToHome = useQuery(getIsSwitchingFromProfileToHome);

  const [homePageQueryExecutor, { data: userData, loading }] = useHomePageLazyQuery({
    fetchPolicy: 'network-only',
    onCompleted: (data: any) => {
      if (data && data.homePage) {
        const {__typename, ...newUser} = data.homePage;
        currentUserProfileVar(newUser); /* this updates the local Apollo state in the cache for the currentUserProfileVar
        reactive variable. Instead of using routing to open a user profile, I'll be using local state to determine
        which user posts to display. In primaryAppBar, when a user is searched for and selected, currentUserProfileVar
        is updated, causing the useGetUserPostsQuery to call with a new userId. */
        loggedInUserProfileVar(newUser);
        // Manually set these react variables to false to avoid case where it randomly appears as true
        isSwitchingFromProfileToHomeVar(false);
        isSwitchingFromHomeToProfileVar(false);
      }
    }
  });
  /* use the lazy query to prevent the "Can't perform a React state update on an unmounted component." error */

  const [getUserPosts] = useLazyQuery(GetUserPostsDocument, {
    fetchPolicy: 'network-only',
    onError: (err) => console.log('get user posts lazy query error', err),
    onCompleted: (data) => {
      isSwitchingFromProfileToHomeVar(false);
    }
  });

  useEffect(
    () => {
      /* Only run the homePageQuery if user has just logged in. We don't want this query running everytime
      the user switches from Profile to Home page. */
      if (!loggedInUserProfileVar() || !loggedInUserProfileVar().id) {
        homePageQueryExecutor();
      }
      if (
        isSwitchingFromProfileToHomeVar() === true &&
        // Prevents infinite loop when the user navigates to their own newsfeed
        currentUserProfileVar().id !== loggedInUserProfileVar().id
      ) {
        // Handles change from logged in user's Profile page to Home
        getUserPosts({
          variables: {
            userId: currentUserProfileVar().id,
            cursor: 0,
            offsetLimit: OFFSET_LIMIT,
            isGettingNewsfeed: false
          }
        });
      }
    },
    [homePageQueryExecutor, getUserPosts]
  ); /* This calls the homePageQuery once to get the currently logged in user */

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={classes.homePageContainer}>
      {(userData && userData.homePage) || (loggedInUserProfileVar() && loggedInUserProfileVar().id) ?
        <>
          <Container maxWidth="sm">
            <div className={classes.currentUserInfoContainer}>
              <Typography variant="h4">
                {`${currentUserProfileVar().firstName} ${currentUserProfileVar().lastName}`}
              </Typography>
              <UserFollowsContainer
                loggedInUser={loggedInUserProfileVar().id}
                userToBeFollowed={currentUserProfileVar().id}
              />
            </div>
            {loggedInUserProfileVar() && currentUserProfileVar().id === loggedInUserProfileVar().id &&
              <PostInputContainer />
            }
            <PostListContainer isGettingNewsfeed={loggedInUserProfileVar() && currentUserProfileVar().id === loggedInUserProfileVar().id} />
          </Container>
        </> :
        <SplashPage />
      }
    </div>
  );
}

export default Home;