import React from 'react';
import { Typography } from '@material-ui/core';
import { useGetFollowersQuery, useGetFollowingQuery } from '../../generated/graphql';

interface Props {
  userId: number;
}

const UserFollows = ({ userId }: Props) => {
  const { data: followingData, loading: followingLoading } = useGetFollowingQuery({ variables: { userId } });

  const { data: followerData, loading: followerLoading } = useGetFollowersQuery({ variables: { userId } });

  if (followingLoading || followerLoading) {
    return (<>Loading</>);
  }

  return (
    <>
      <Typography variant="h5">Following: {followingData ? followingData?.getFollowing?.length : 0}</Typography>
      <Typography variant="h5">Followers: {followerData ? followerData?.getFollowers?.length : 0}</Typography>
    </>
  );
}

export default UserFollows;