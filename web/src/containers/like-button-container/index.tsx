import React from 'react';
import { CommentLike, PostLike } from '../../generated/graphql';
import { loggedInUserProfileVar } from '../../cache';
import LikeButton from '../../components/like-button';

interface Props {
  item: any;
  likeMutation: any
}

const LikeButtonContainer = ({ item, likeMutation}: Props) => {

  const isAlreadyLiked: boolean = item && item.likes ?
    item.likes.some((like: PostLike | CommentLike) => like.user && like.user.id === loggedInUserProfileVar().id) : false;

  const handleLikeButtonClick = () => {
    likeMutation(loggedInUserProfileVar().id, item.id, isAlreadyLiked);
  }

  return (
    <LikeButton
      isAlreadyLiked={isAlreadyLiked}
      handleLikeButtonClick={handleLikeButtonClick}
    />
  );
};

export default LikeButtonContainer;