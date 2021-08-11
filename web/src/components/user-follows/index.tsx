import React from 'react';
import { Typography } from '@material-ui/core';

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
      <Typography variant="h5">Following: {following ? following?.getFollowing?.length : 0}</Typography>
      <Typography variant="h5">Followers: {followers ? followers?.getFollowers?.length : 0}</Typography>
    </>
  );
}

export default UserFollows;