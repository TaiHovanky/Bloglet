import React from 'react';
import { Button } from '@material-ui/core';
import { Post, UserLikesPosts } from '../../generated/graphql';

interface Props {
  post: Post;
  userId: number,
  likePost: any
}

const LikeButton = ({ post, userId, likePost}: Props) => {
  const isAlreadyLiked: boolean = post && post.likes ?
    post.likes.some((like: UserLikesPosts) => like.user.id === userId) : false;

  return (
    <Button
      variant={isAlreadyLiked ? "contained" : "outlined"}
      color="primary"
      onClick={() => likePost(userId, post, isAlreadyLiked)}
    >
      {isAlreadyLiked ? 'Liked' : 'Like'}
    </Button>
  );
};

export default LikeButton;