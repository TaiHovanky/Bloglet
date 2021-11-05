import React from 'react';
import FollowButton from '../../components/follow-button';
import UserFollows from '../../components/user-follows';
import { useMutation } from '@apollo/client';
import { currentUserProfileVar } from '../../cache';
import { Follows, FollowUserDocument, useGetFollowersQuery, useGetFollowingQuery } from '../../generated/graphql';

interface Props {
  loggedInUser: number;
  userToBeFollowed: number;
}

const UserFollowsContainer = ({ loggedInUser, userToBeFollowed }: Props) => {
  const { data: followingData, loading: followingLoading } = useGetFollowingQuery({
    variables: { userId: currentUserProfileVar().id }
  });

  const { data: followerData, loading: followerLoading } = useGetFollowersQuery({
    variables: { userId: currentUserProfileVar().id }
  });

  const [followUser, { loading }] = useMutation(FollowUserDocument, {
    update(cache, data) {
      cache.modify({
        fields: {
          getFollowers(existingFollowers: Array<Follows>) {
            const oldFollowers: Array<Follows> = existingFollowers ? [...existingFollowers] : [];
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

  const isLoggedInUserFollowing: boolean = !!followerData &&
    !!followerData.getFollowers &&
    followerData.getFollowers.some((follower: any) => {
        return follower && follower.follower ? follower.follower.id === loggedInUser : false;
      });

  const handleFollowUser = () => {
    followUser({
      variables: {
        loggedInUser,
        userToBeFollowed,
        isAlreadyFollowing: isLoggedInUserFollowing
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
        isLoggedInUserFollowing={isLoggedInUserFollowing}
        loading={loading}
        handleFollowUser={handleFollowUser}
      />
    </>
  );
}

export default UserFollowsContainer;