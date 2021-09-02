import React from 'react';
import { Button } from '@material-ui/core';
import { Follows, FollowUserDocument } from '../../generated/graphql';
import { useMutation } from '@apollo/client';

interface Props {
  followers: any;
  loggedInUser: number;
  userToBeFollowed: number;
}

const FollowButton = ({
  followers,
  loggedInUser,
  userToBeFollowed
}: Props) => {

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

  const isLoggedInUserFollowing = followers &&
    followers.getFollowers &&
    followers.getFollowers.some((follower: any) => {
      return follower && follower.follower ? follower.follower.id === loggedInUser : false;
    });

  const handleClick = () => {
    followUser({
      variables: {
        loggedInUser,
        userToBeFollowed,
        isAlreadyFollowing: isLoggedInUserFollowing
      }
    });
  }

  return (
    <Button
      variant={isLoggedInUserFollowing ? "contained" : "outlined"}
      color="primary"
      onClick={handleClick}
      disabled={loading}
    >
      {isLoggedInUserFollowing ? 'Following' : 'Follow'}
    </Button>
  );
}

export default FollowButton;
