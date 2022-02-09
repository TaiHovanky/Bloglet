import React, { useEffect } from 'react';
import { Container, makeStyles, Typography } from '@material-ui/core';
import { useLazyQuery, useQuery } from '@apollo/client';
import getCurrentGetUserPostsCursor from '../../cache-queries/current-user-posts-cursor';
import { currentGetUserPostsCursorVar, currentUserProfileVar, isSwitchingFromHomeToProfileVar, isSwitchingFromProfileToHomeVar, loggedInUserProfileVar } from '../../cache';
import UserFollowsContainer from '../../containers/user-follows-container';
import PostInputContainer from '../../containers/post-input-container';
import PostListContainer from '../../containers/post-list-container';
import getLoggedInUserProfile from '../../cache-queries/logged-in-user-profile';
import { OFFSET_LIMIT } from '../../hooks/use-scroll.hook';
import { GetUserPostsDocument } from '../../generated/graphql';
import { RouteComponentProps } from 'react-router';
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

const Profile: React.FC<RouteComponentProps> = () => {
  const classes = useStyles();

  // eslint-disable-next-line
  const currentGetUserPostsCursor = useQuery(getCurrentGetUserPostsCursor);
  // eslint-disable-next-line
  const loggedInUserProfile = useQuery(getLoggedInUserProfile);
  // eslint-disable-next-line
  const isSwitchingFromHomeToProfile = useQuery(getIsSwitchingFromHomeToProfile);
  // eslint-disable-next-line
  const isSwitchingFromProfileToHome = useQuery(getIsSwitchingFromProfileToHome);

  const [getUserPosts] = useLazyQuery(GetUserPostsDocument, {
    fetchPolicy: 'network-only',
    onError: (err) => console.log('get user posts lazy query error', err),
  });

  useEffect(() => {
    isSwitchingFromHomeToProfileVar(true);
    currentGetUserPostsCursorVar(0);
    currentUserProfileVar(loggedInUserProfileVar());
    getUserPosts({
      variables: {
        userId: loggedInUserProfileVar().id,
        cursor: 0,
        offsetLimit: OFFSET_LIMIT,
        isGettingNewsfeed: false
      },
    });

    return function cleanupPostsList() {
      isSwitchingFromHomeToProfileVar(false);
      isSwitchingFromProfileToHomeVar(true);
    }
  }, [getUserPosts]);

  return (
    <div className={classes.homePageContainer}>
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
        <PostListContainer isGettingNewsfeed={false} getUserPosts={getUserPosts} />
      </Container>
    </div>
  );
}

export default Profile;