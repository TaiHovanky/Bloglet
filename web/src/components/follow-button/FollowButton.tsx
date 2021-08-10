import React from 'react';
import { Button } from '@material-ui/core';
import { useFollowUserMutation } from '../../generated/graphql';

interface Props {
  loggedInUser: number,
  userToBeFollowed: number
}

const FollowButton = ({ loggedInUser, userToBeFollowed }: Props) => {
  const [followUser] = useFollowUserMutation();

  const handleClick = () => {
    followUser({
      variables: {
        loggedInUser,
        userToBeFollowed
      }
    });
  }

  return (
    <Button variant="contained" color="primary" onClick={handleClick}>Follow</Button>
  );
}

export default FollowButton;
