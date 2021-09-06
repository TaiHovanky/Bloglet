import React from 'react';
import { Button } from '@material-ui/core';
import { CommentLike, PostLike } from '../../generated/graphql';

interface Props {
  item: any;
  userId: number,
  likeMutation: any
}

const LikeButton = ({ item, userId, likeMutation}: Props) => {
  const isAlreadyLiked: boolean = item && item.likes ?
    item.likes.some((like: PostLike | CommentLike) => like.user && like.user.id === userId) : false;

  return (
    <Button
      variant={isAlreadyLiked ? "contained" : "outlined"}
      color="primary"
      onClick={() => likeMutation(userId, item.id, isAlreadyLiked)}
    >
      {isAlreadyLiked ? 'Liked' : 'Like'}
    </Button>
  );
};

export default LikeButton;