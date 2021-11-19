import React, { useEffect } from 'react';
import { Container, makeStyles, Typography } from '@material-ui/core';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
  GetUserPostsDocument,
  useHomePageLazyQuery,
} from '../../generated/graphql';
import SplashPage from '../../components/splash-page';
import getCurrentUserProfile from '../../cache-queries/current-user-profile';
import getCurrentGetUserPostsCursor from '../../cache-queries/current-user-posts-cursor';
import { currentUserProfileVar, isSwitchingBetweenHomeAndProfileVar, loggedInUserProfileVar } from '../../cache';
import UserFollowsContainer from '../../containers/user-follows-container';
import PostInputContainer from '../../containers/post-input-container';
import PostListContainer from '../../containers/post-list-container';
// import PrimaryAppBarContainer from '../../containers/primary-app-bar-container';
import getLoggedInUserProfile from '../../cache-queries/logged-in-user-profile';
import { RouteComponentProps } from 'react-router';
import clearUserPosts from '../../cache-queries/clear-user-posts';
import getIsSwitchingBetweenHomeAndProfile from '../../cache-queries/is-switching-between-home-and-profile';
import { OFFSET_LIMIT } from '../../hooks/use-scroll.hook';

const useStyles = makeStyles(() => ({
  homePageContainer: {
    minHeight: '100vh'
  },
  currentUserInfoContainer: {
    marginBottom: 30
  }
}));

// export const LoggedInUserContext = createContext(0);

const Home: React.FC<RouteComponentProps> = () => {
  const classes = useStyles();

  // eslint-disable-next-line
  const currentUserProfile = useQuery(getCurrentUserProfile);
  // eslint-disable-next-line
  const currentGetUserPostsCursor = useQuery(getCurrentGetUserPostsCursor);
  // eslint-disable-next-line
  const loggedInUserProfile = useQuery(getLoggedInUserProfile);
  // eslint-disable-next-line
  const isSwitchingBetweenHomeAndProfile = useQuery(getIsSwitchingBetweenHomeAndProfile);

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
        isSwitchingBetweenHomeAndProfileVar(false);
      }
    }
  });
  /* use the lazy query to prevent the "Can't perform a React state update on an unmounted component." error */

  const [clearPosts] = useMutation(clearUserPosts, {
    update(cache) {
      cache.modify({
        fields: {
          getUserPosts() {
            return [];
          }
        }
      });
    }
  });

  const [getUserPosts] = useLazyQuery(GetUserPostsDocument, {
    fetchPolicy: 'network-only',
    onError: (err) => console.log('get user posts lazy query error', err),
    onCompleted: (data) => {
      isSwitchingBetweenHomeAndProfileVar(false);
      console.log('lazy get user posts home', data, isSwitchingBetweenHomeAndProfileVar());
    }
  });

  useEffect(
    () => {
      if (!loggedInUserProfileVar() || !loggedInUserProfileVar().id) {
        homePageQueryExecutor();
      }
      if (
        isSwitchingBetweenHomeAndProfileVar() === true
        && currentUserProfileVar().id !== loggedInUserProfileVar().id
      ) {
        console.log('was switching profile to home', currentUserProfileVar().id);
        // handles change from logged in user's Profile page to Home
        getUserPosts({
          variables: {
            userId: currentUserProfileVar().id,
            cursor: 0,
            offsetLimit: OFFSET_LIMIT,
            isGettingNewsfeed: false
          }
        });
        isSwitchingBetweenHomeAndProfileVar(false);
      }
      return function cleanupPostsList() {
        isSwitchingBetweenHomeAndProfileVar(true);
        clearPosts();
      }
    },
    [homePageQueryExecutor, clearPosts, getUserPosts]
  ); /* This calls the homePageQuery once to get the currently logged in user */

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log('home', isSwitchingBetweenHomeAndProfileVar());
  return (
    <div className={classes.homePageContainer}>
      {(userData && userData.homePage) || (loggedInUserProfileVar() && loggedInUserProfileVar().id) ?
        <>
          {/* <PrimaryAppBarContainer history={history} /> */}
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