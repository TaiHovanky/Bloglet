import React, { useEffect } from 'react';
import { Container, makeStyles, Typography } from '@material-ui/core';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import getCurrentGetUserPostsCursor from '../../cache-queries/current-user-posts-cursor';
import { currentGetUserPostsCursorVar, currentUserProfileVar, isSwitchingBetweenHomeAndProfileVar, loggedInUserProfileVar } from '../../cache';
import UserFollowsContainer from '../../containers/user-follows-container';
import PostInputContainer from '../../containers/post-input-container';
import PostListContainer from '../../containers/post-list-container';
// import PrimaryAppBarContainer from '../../containers/primary-app-bar-container';
import getLoggedInUserProfile from '../../cache-queries/logged-in-user-profile';
import clearUserPosts from '../../cache-queries/clear-user-posts';
import { OFFSET_LIMIT } from '../../hooks/use-scroll.hook';
import { GetUserPostsDocument } from '../../generated/graphql';
import { RouteComponentProps } from 'react-router';
import getIsSwitchingBetweenHomeAndProfile from '../../cache-queries/is-switching-between-home-and-profile';

const useStyles = makeStyles(() => ({
  homePageContainer: {
    minHeight: '100vh'
  },
  currentUserInfoContainer: {
    marginBottom: 30
  }
}));

const Profile: React.FC<RouteComponentProps> = () => {
  const classes = useStyles();

  // eslint-disable-next-line
  const currentGetUserPostsCursor = useQuery(getCurrentGetUserPostsCursor);
  // eslint-disable-next-line
  const loggedInUserProfile = useQuery(getLoggedInUserProfile);
  // eslint-disable-next-line
  const isSwitchingBetweenHomeAndProfile = useQuery(getIsSwitchingBetweenHomeAndProfile);

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
      console.log('lazy get profile posts', data, isSwitchingBetweenHomeAndProfileVar());
    }
  });

  useEffect(() => {
    // clearPosts();
    currentGetUserPostsCursorVar(0);
    currentUserProfileVar(loggedInUserProfileVar());
    console.log('loading profile', currentUserProfileVar().id, isSwitchingBetweenHomeAndProfileVar())
    getUserPosts({
      variables: {
        userId: loggedInUserProfileVar().id,
        cursor: 0,
        offsetLimit: OFFSET_LIMIT,
        isGettingNewsfeed: false
      },
    });
    // isSwitchingBetweenHomeAndProfileVar(false);
    return function cleanupPostsList() {
      clearPosts();
      // isSwitchingBetweenHomeAndProfileVar(true);
    }
  }, [clearPosts, getUserPosts]);

  return (
    <div className={classes.homePageContainer}>
      {/* <PrimaryAppBarContainer history={history} /> */}
      <Container maxWidth="sm">
        <div className={classes.currentUserInfoContainer}>
          <Typography variant="h4">
            {`${loggedInUserProfileVar().firstName} ${loggedInUserProfileVar().lastName}`}
          </Typography>
          <UserFollowsContainer
            loggedInUser={loggedInUserProfileVar().id}
            userToBeFollowed={currentUserProfileVar().id}
          />
        </div>
        <PostInputContainer />
        <PostListContainer isGettingNewsfeed={false} />
      </Container>
    </div>
  );
}

export default Profile;