import React from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import PrimaryAppBar from '../../components/primary-app-bar';
import { GetUserPostsDocument, useSearchUsersLazyQuery } from '../../generated/graphql';
import clearUserPosts from '../../cache-queries/clear-user-posts';
import { isSwitchingBetweenHomeAndProfileVar } from '../../cache';

// interface Props {
//   history?: any;
// }

const PrimaryAppBarContainer = (
  // { history }: Props
) => {
  const [clearPosts] = useMutation(clearUserPosts, {
    update(cache) {
      cache.modify({
        fields: {
          getUserPosts() {
            console.log('clearing posts in cache.mod')
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
      isSwitchingBetweenHomeAndProfileVar(false);
      console.log('lazy get user posts primary', data, isSwitchingBetweenHomeAndProfileVar());
    }
  });

  const [searchUsers, { data }] = useSearchUsersLazyQuery();

  return (
    <PrimaryAppBar
      // history={history}
      searchUsers={searchUsers}
      getUserPosts={getUserPosts}
      clearPosts={clearPosts}
      data={data}
    />
  );
}

export default PrimaryAppBarContainer;