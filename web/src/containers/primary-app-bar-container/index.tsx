import React from 'react';
import { useMutation, useReactiveVar } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import PrimaryAppBar from '../../components/primary-app-bar';
import { User, useSearchUsersLazyQuery } from '../../generated/graphql';
import clearUserPosts from '../../cache-queries/clear-user-posts';
import { currentGetUserPostsCursorVar, currentUserProfileVar, loggedInUserProfileVar } from '../../cache';

const PrimaryAppBarContainer = () => {
  const history = useHistory();

  const loggedInUser: User = useReactiveVar(loggedInUserProfileVar);

  const [clearPosts] = useMutation(clearUserPosts, {
    update(cache) {
      cache.modify({
        fields: {
          getUserPosts() {
            return [];
          }
        }
      });
    }
  });

  const [searchUsers, { data }] = useSearchUsersLazyQuery();

  const handleMenuClick = (user: User, handleClose: () => void): void => {
    currentUserProfileVar(user);
    currentGetUserPostsCursorVar(0);
    clearPosts();
    handleClose();
    setTimeout(() => {
      history.push('/profile');
    }, 0);
  };

  const handleHomePageClick = () => {
    currentUserProfileVar(loggedInUser);
  };

  return (
    <PrimaryAppBar
      searchUsers={searchUsers}
      data={data}
      loggedInUser={loggedInUser}
      handleMenuClick={handleMenuClick}
      handleHomePageClick={handleHomePageClick}
    />
  );
}

export default PrimaryAppBarContainer;