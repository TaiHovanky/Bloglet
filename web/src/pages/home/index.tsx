import React, { useEffect } from 'react';
import { Container, makeStyles, Typography, Backdrop, CircularProgress } from '@material-ui/core';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import {
  GetUserPostsDocument,
  useHomePageLazyQuery,
} from '../../generated/graphql';
import SplashPage from '../../components/splash-page';
import { currentUserProfileVar, loggedInUserProfileVar, currentGetUserPostsCursorVar } from '../../cache';
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

  // eslint-disable-next-line
  const currentGetUserPostsCursor = useReactiveVar(currentGetUserPostsCursorVar);
  // eslint-disable-next-line
  const loggedInUserProfile = useReactiveVar(loggedInUserProfileVar);
  // eslint-disable-next-line
  const currentUserProfile = useReactiveVar(currentUserProfileVar);
  const loggedInUser = useReactiveVar(loggedInUserProfileVar);

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
      if (!loggedInUserProfileVar() || !loggedInUserProfileVar().id) {
        homePageQueryExecutor();
      }
      getUserPosts({
        variables: {
          userId: loggedInUser.id,
          cursor: 0,
          offsetLimit: OFFSET_LIMIT,
          isGettingNewsfeed: true
        }
      });
    },
    [homePageQueryExecutor, getUserPosts, loggedInUser]
  ); /* This calls the homePageQuery once to get the currently logged in user's newsfeed */

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
            <PostListContainer
              isGettingNewsfeed={true}
              history={history}
            />
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