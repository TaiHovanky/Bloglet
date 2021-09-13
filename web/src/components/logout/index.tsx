import React from 'react';
import { ListItem, ListItemText, makeStyles } from '@material-ui/core';
import { useLogoutMutation } from '../../generated/graphql';
import { setAccessToken } from '../../accessToken';

interface Props {}

const useStyles = makeStyles(() => ({
  logoutItemText: {
    fontWeight: 'bold',
    color: '#fff'
  }
}));

const Logout: React.FC<Props> = () => {
  const classes = useStyles();
  const [logout, { client }] = useLogoutMutation();

  const handleLogoutClick = async () => {
    await logout();
    setAccessToken(''); // clear the global access token variable
    await client.resetStore(); // resets the apollo client store
  };

  return (
    <ListItem button onClick={handleLogoutClick}>
      <ListItemText className={classes.logoutItemText} primary="Logout" />
    </ListItem>
  );
}

export default Logout;