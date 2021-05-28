import React from 'react';
import { ListItem, ListItemText } from '@material-ui/core';
import { useLogoutMutation } from '../generated/graphql';
import { setAccessToken } from '../accessToken';

interface Props {}

const Logout: React.FC<Props> = () => {
  const [logout, { client }] = useLogoutMutation();

  const handleLogoutClick = async () => {
    await logout();
    setAccessToken(''); // clear the global access token variable
    await client.resetStore(); // resets the apollo client store
  };

  return (
    <ListItem button onClick={handleLogoutClick}>
      <ListItemText primary="Logout" />
    </ListItem>
  );
}

export default Logout;