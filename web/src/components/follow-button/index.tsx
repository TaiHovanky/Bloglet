import React from 'react';
import { Button } from '@material-ui/core';
import { useFollowUserMutation } from '../../generated/graphql';

interface Props {
  followers: any;
  loggedInUser: number;
  refetchFollowers: Function;
  userToBeFollowed: number;
}

const FollowButton = ({
  followers,
  loggedInUser,
  refetchFollowers,
  userToBeFollowed
}: Props) => {
  const [followUser] = useFollowUserMutation();
  const isLoggedInUserFollowing = followers &&
    followers.getFollowers &&
    followers.getFollowers.some((follower: any) => follower.follower.id === loggedInUser);

  const handleClick = async () => {
    await followUser({
      variables: {
        loggedInUser,
        userToBeFollowed,
        isAlreadyFollowing: isLoggedInUserFollowing
      }
    });
    refetchFollowers();
  }

  return (
    <Button
      variant={isLoggedInUserFollowing ? "contained" : "outlined"}
      color="primary"
      onClick={handleClick}
    >
      {isLoggedInUserFollowing ? 'Following' : 'Follow'}
    </Button>
  );
}

export default FollowButton;
