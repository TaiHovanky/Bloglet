import React from 'react';
import { ListItem, ListItemText } from '@material-ui/core';
import { useLogoutMutation } from '../generated/graphql';

interface Props {}

const Logout: React.FC<Props> = () => {
  const [logout] = useLogoutMutation();
  const handleLogoutClick = async () => {
    await logout();
  };

  return (
    <ListItem button onClick={handleLogoutClick}>
      <ListItemText primary="Logout" />
    </ListItem>
  );
}

export default Logout;