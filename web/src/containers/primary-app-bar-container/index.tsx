import React from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import PrimaryAppBar from '../../components/primary-app-bar';
import { GetUserPostsDocument, User, useSearchUsersLazyQuery } from '../../generated/graphql';
import clearUserPosts from '../../cache-queries/clear-user-posts';
import { currentGetUserPostsCursorVar, currentUserProfileVar, isSwitchingFromProfileToHomeVar, loggedInUserProfileVar } from '../../cache';
import { OFFSET_LIMIT } from '../../hooks/use-scroll.hook';

const PrimaryAppBarContainer = () => {
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

  const [getUserPosts] = useLazyQuery(GetUserPostsDocument, {
    fetchPolicy: 'network-only',
    onError: (err) => console.log('get user posts lazy query error', err),
    onCompleted: (data) => {
      isSwitchingFromProfileToHomeVar(false);
    }
  });

  const [searchUsers, { data }] = useSearchUsersLazyQuery();

  const handleMenuClick = (user: User, handleClose: () => void): void => {
    clearPosts();
    currentUserProfileVar({...user});
    currentGetUserPostsCursorVar(0);
    // Handles switching between user profiles while still on Home
    getUserPosts({
      variables: {
        userId: user.id,
        cursor: 0,
        offsetLimit: OFFSET_LIMIT,
        isGettingNewsfeed: currentUserProfileVar().id === loggedInUserProfileVar().id
      }
    });
    handleClose();
  };

  return (
    <PrimaryAppBar
      searchUsers={searchUsers}
      data={data}
      handleMenuClick={handleMenuClick}
    />
  );
}

export default PrimaryAppBarContainer;