import React from 'react';
import { Button } from '@material-ui/core';

interface Props {
  loading: boolean,
  loggedInUser: number,
  followers: any,
  handleFollowUser: (isAlreadyFollowing: boolean) => void,
}

const FollowButton = ({
  followers,
  loggedInUser,
  loading,
  handleFollowUser
}: Props) => {
  const isLoggedInUserFollowing: boolean = !!followers &&
    !!followers.getFollowers &&
    followers.getFollowers.some((follower: any) => {
      return follower && follower.follower ? follower.follower.id === loggedInUser : false;
    });

  return (
    <Button
      variant={isLoggedInUserFollowing ? "contained" : "outlined"}
      color="primary"
      onClick={() => handleFollowUser(isLoggedInUserFollowing)}
      disabled={loading}
    >
      {isLoggedInUserFollowing ? 'Following' : 'Follow'}
    </Button>
  );
}

export default FollowButton;
