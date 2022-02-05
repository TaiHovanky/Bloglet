import React from 'react';
import { ListItem, ListItemText, makeStyles } from '@material-ui/core';
import { useLogoutMutation } from '../../generated/graphql';
import { loggedInUserProfileVar } from '../../cache';
import User from '../../types/user.interface';

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
    loggedInUserProfileVar(new User(0, '', '', ''));
    await client.resetStore(); // resets the apollo client store
  };

  return (
    <ListItem button onClick={handleLogoutClick}>
      <ListItemText className={classes.logoutItemText} primary="Logout" />
    </ListItem>
  );
}

export default Logout;