import React from 'react';
import { useLogoutMutation } from '../../generated/graphql';
import { loggedInUserProfileVar } from '../../cache';
import User from '../../types/user.interface';
import Logout from '../../components/logout';

interface Props {
  history?: any;
}

const LogoutContainer: React.FC<Props> = ({ history }) => {
  const [logout, { client }] = useLogoutMutation();

  const handleLogoutClick = async () => {
    await logout();
    loggedInUserProfileVar(new User(0, '', '', ''));
    await client.resetStore(); // resets the apollo client store
    // history.push('/');
  };

  return (
    <Logout handleLogoutClick={handleLogoutClick} />
  );
}

export default LogoutContainer;