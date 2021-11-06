import React from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import PrimaryAppBar from '../../components/primary-app-bar';
import { GetUserPostsDocument, User, useSearchUsersLazyQuery } from '../../generated/graphql';
import clearUserPosts from '../../cache-queries/clear-user-posts';

interface Props {
  user?: User
}

const PrimaryAppBarContainer = ({ user }: Props) => {
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
    onCompleted: (lazydata: any) => console.log('lazzzzzyyyyyy', lazydata),
  });

  const [searchUsers, { data }] = useSearchUsersLazyQuery();

  return (
    <PrimaryAppBar
      user={user}
      searchUsers={searchUsers}
      getUserPosts={getUserPosts}
      clearPosts={clearPosts}
      data={data}
    />
  );
}

export default PrimaryAppBarContainer;