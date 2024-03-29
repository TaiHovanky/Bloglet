import React from 'react';
import FollowButton from '../../components/follow-button';
import UserFollows from '../../components/user-follows';
import { useMutation, useReactiveVar } from '@apollo/client';
import { currentUserProfileVar } from '../../cache';
import { Follows, FollowUserDocument, useGetFollowersQuery, useGetFollowingQuery, User } from '../../generated/graphql';

interface Props {
  loggedInUser: number;
  userToBeFollowed: number;
}

const UserFollowsContainer = ({ loggedInUser, userToBeFollowed }: Props) => {
  const currentUserProfile: User = useReactiveVar(currentUserProfileVar);

  const { data: followingData, loading: followingLoading } = useGetFollowingQuery({
    variables: { userId: currentUserProfile.id },
    fetchPolicy: 'network-only'
  });

  const { data: followerData, loading: followerLoading } = useGetFollowersQuery({
    variables: { userId: currentUserProfile.id },
    fetchPolicy: 'network-only'
  });

  const [followUser, { loading }] = useMutation(FollowUserDocument, {
    update(cache, data) {
      cache.modify({
        fields: {
          getFollowers(existingFollowers: any) {
            const oldFollowers: Array<any> = existingFollowers ? [...existingFollowers] : [];
            if (!data.data.followUser) {
              const unfollowedIndex = oldFollowers.findIndex((follow) => {
                return follow && follow.follower ? follow.follower.id === loggedInUser : false;
              });
              oldFollowers.splice(unfollowedIndex, 1);
            }
            return data.data.followUser ? [...oldFollowers, data.data.followUser] : oldFollowers;
          }
        }
      });
    }
  });

  const handleFollowUser = (isAlreadyFollowing: boolean) => {
    followUser({
      variables: {
        loggedInUser,
        userToBeFollowed,
        isAlreadyFollowing
      }
    });
  }

  return (
    <>
      <UserFollows
        followers={followerData}
        following={followingData}
        followerLoading={followerLoading}
        followingLoading={followingLoading}
      />
      <FollowButton
        followers={followerData}
        loggedInUser={loggedInUser}
        loading={loading}
        handleFollowUser={handleFollowUser}
      />
    </>
  );
}

export default UserFollowsContainer;