import React from 'react';
import { Button } from '@material-ui/core';

interface Props {
  userToBeFollowed: number,
  loggedInUser: number
}

const FollowButton = (props: Props) => {
  console.log('follow button props', props);

  return (
    <Button variant="contained" color="primary">Follow</Button>
  );
}

export default FollowButton;
