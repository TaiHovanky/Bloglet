import React from 'react';
import { Grid, Typography } from '@material-ui/core';

interface Props {
  followers: any;
  following: any;
  followerLoading: boolean;
  followingLoading: boolean;
}

const UserFollows = ({
  followers,
  following,
  followerLoading,
  followingLoading
}: Props) => {
  
  if (followingLoading || followerLoading) {
    return (<>Loading</>);
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Typography variant="subtitle1">Following: {following ? following?.getFollowing?.length : 0}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="subtitle1">Followers: {followers ? followers?.getFollowers?.length : 0}</Typography>
        </Grid>
      </Grid>
    </>
  );
}

export default UserFollows;