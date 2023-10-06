import React, { useEffect } from 'react';
import { Container, makeStyles, Typography, Backdrop, CircularProgress } from '@material-ui/core';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import {
  GetUserPostsDocument,
  useHomePageLazyQuery,
  User
} from '../../generated/graphql';
import SplashPage from '../../components/splash-page';
import { currentUserProfileVar, loggedInUserProfileVar } from '../../cache';
import UserFollowsContainer from '../../containers/user-follows-container';
import PostInputContainer from '../../containers/post-input-container';
import PostListContainer from '../../containers/post-list-container';
import { RouteComponentProps } from 'react-router';
import { OFFSET_LIMIT } from '../../hooks/use-scroll.hook';

const useStyles = makeStyles((theme) => ({
  homePageContainer: {
    minHeight: '100vh'
  },
  currentUserInfoContainer: {
    marginBottom: 30
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const Home: React.FC<RouteComponentProps> = ({ history }) => {
  const classes = useStyles();

  const currentUserProfile: User = useReactiveVar(currentUserProfileVar);
  const loggedInUser: User = useReactiveVar(loggedInUserProfileVar);

  const [homePageQueryExecutor, { data: userData, loading }] = useHomePageLazyQuery({
    fetchPolicy: 'network-only',
    onCompleted: (data: any) => {
      if (data && data.homePage) {
        const {__typename, ...newUser} = data.homePage;
        getUserPosts({
          variables: {
            userId: newUser.id,
            cursor: 0,
            offsetLimit: OFFSET_LIMIT,
            isGettingNewsfeed: true
          }
        });
        currentUserProfileVar(newUser); /* this updates the local Apollo state in the cache for the currentUserProfileVar
        reactive variable. Instead of using routing to open a user profile, I'll be using local state to determine
        which user posts to display. In primaryAppBar, when a user is searched for and selected, currentUserProfileVar
        is updated, causing the useGetUserPostsQuery to call with a new userId. */
        loggedInUserProfileVar(newUser);
      }
    }
  });
  /* use the lazy query to prevent the "Can't perform a React state update on an unmounted component." error */

  const [getUserPosts, { loading: postsLoading }] = useLazyQuery(GetUserPostsDocument, {
    fetchPolicy: 'network-only',
    onError: (err) => console.log('get user posts lazy query error', err)
  });

  useEffect(
    () => {
      /* Only run the homePageQuery if user has just logged in. We don't want this query running everytime
      the user switches from Profile to Home page. */
      if (!loggedInUser || !loggedInUser.id) {
        homePageQueryExecutor();
      } else {
        getUserPosts({
          variables: {
            userId: loggedInUser.id,
            cursor: 0,
            offsetLimit: OFFSET_LIMIT,
            isGettingNewsfeed: true
          }
        });
      }

      return () => {}
    },
    [homePageQueryExecutor, getUserPosts, loggedInUser]
  ); /* This calls the homePageQuery once to get the currently logged in user's newsfeed */

  return (
    <div className={classes.homePageContainer}>
      {(userData && userData.homePage) || (loggedInUser && loggedInUser.id) ?
        <>
          <Container maxWidth="sm">
            <div className={classes.currentUserInfoContainer}>
              <Typography variant="h4">
                {`${currentUserProfile.firstName} ${currentUserProfile.lastName}`}
              </Typography>
              <UserFollowsContainer
                loggedInUser={loggedInUser.id}
                userToBeFollowed={currentUserProfile.id}
              />
            </div>
            {loggedInUser && currentUserProfile.id === loggedInUser.id &&
              <PostInputContainer />
            }
            <PostListContainer isGettingNewsfeed={true} />
          </Container>
        </> :
        <SplashPage />
      }
      <Backdrop className={classes.backdrop} open={loading || postsLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default Home;