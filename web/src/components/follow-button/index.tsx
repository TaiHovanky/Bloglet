import React from 'react';
import { Button } from '@material-ui/core';

interface Props {
  isLoggedInUserFollowing: boolean,
  loading: boolean,
  handleFollowUser: () => void,
}

const FollowButton = ({
  isLoggedInUserFollowing,
  loading,
  handleFollowUser
}: Props) => {
  return (
    <Button
      variant={isLoggedInUserFollowing ? "contained" : "outlined"}
      color="primary"
      onClick={handleFollowUser}
      disabled={loading}
    >
      {isLoggedInUserFollowing ? 'Following' : 'Follow'}
    </Button>
  );
}

export default FollowButton;
