import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { CommentLike, PostLike, User } from '../../generated/graphql';
import { loggedInUserProfileVar } from '../../cache';
import LikeButton from '../../components/like-button';

interface Props {
  item: any;
  likeMutation: any
}

const LikeButtonContainer = ({ item, likeMutation}: Props) => {
  const loggedInUser: User = useReactiveVar(loggedInUserProfileVar);

  const isAlreadyLiked: boolean = item && item.likes ?
    item.likes.some((like: PostLike | CommentLike) => like.user && like.user.id === loggedInUser.id) : false;

  const handleLikeButtonClick = (): void => {
    likeMutation(loggedInUser.id, item.id, isAlreadyLiked);
  }

  return (
    <LikeButton
      isAlreadyLiked={isAlreadyLiked}
      handleLikeButtonClick={handleLikeButtonClick}
    />
  );
};

export default LikeButtonContainer;