import React, { useEffect } from 'react';
import { Backdrop, CircularProgress, Container, makeStyles, Typography } from '@material-ui/core';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { RouteComponentProps } from 'react-router';
import { currentGetUserPostsCursorVar, currentUserProfileVar, loggedInUserProfileVar } from '../../cache';
import UserFollowsContainer from '../../containers/user-follows-container';
import PostInputContainer from '../../containers/post-input-container';
import PostListContainer from '../../containers/post-list-container';
import { OFFSET_LIMIT } from '../../hooks/use-scroll.hook';
import { GetUserPostsDocument } from '../../generated/graphql';

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

const Profile: React.FC<RouteComponentProps> = ({ history }) => {
  const classes = useStyles();

  // eslint-disable-next-line
  const currentGetUserPostsCursor = useReactiveVar(currentGetUserPostsCursorVar);
  // eslint-disable-next-line
  const loggedInUserProfile = useReactiveVar(loggedInUserProfileVar);
  const currentUserProfile = useReactiveVar(currentUserProfileVar);

  const [getUserPosts, { loading }] = useLazyQuery(GetUserPostsDocument, {
    fetchPolicy: 'network-only',
    onError: (err) => console.log('get user posts lazy query error', err),
  });


  useEffect(() => {
    currentGetUserPostsCursorVar(0);
    getUserPosts({
      variables: {
        userId: currentUserProfile.id,
        cursor: 0,
        offsetLimit: OFFSET_LIMIT,
        isGettingNewsfeed: false
      },
    });
  }, [getUserPosts, currentUserProfile]);

  return (
    <div className={classes.homePageContainer}>
      <Container maxWidth="sm">
        <div className={classes.currentUserInfoContainer}>
          <Typography variant="h4">
            {`${currentUserProfileVar().firstName} ${currentUserProfileVar().lastName}'s Profile`}
          </Typography>
          <UserFollowsContainer
            loggedInUser={loggedInUserProfileVar().id}
            userToBeFollowed={currentUserProfileVar().id}
          />
        </div>
        <PostInputContainer />
        <PostListContainer
          isGettingNewsfeed={false}
          history={history}
        />
      </Container>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default Profile;