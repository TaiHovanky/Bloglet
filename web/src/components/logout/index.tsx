import React from 'react';
import { ListItem, ListItemText, makeStyles } from '@material-ui/core';

interface Props {
  handleLogoutClick: () => any
}

const useStyles = makeStyles(() => ({
  logoutItemText: {
    fontWeight: 'bold',
    color: '#fff'
  }
}));

const Logout: React.FC<Props> = ({ handleLogoutClick }) => {
  const classes = useStyles();

  return (
    <ListItem button onClick={handleLogoutClick}>
      <ListItemText className={classes.logoutItemText} primary="Logout" />
    </ListItem>
  );
}

export default Logout;