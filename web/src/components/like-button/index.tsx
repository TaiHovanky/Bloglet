import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import { ThumbUp, ThumbUpOutlined } from '@material-ui/icons';
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
    <IconButton
      color="primary"
      size="small"
      onClick={() => likeMutation(userId, item.id, isAlreadyLiked)}
    >
      {isAlreadyLiked ? <ThumbUp /> : <ThumbUpOutlined />}
    </IconButton>
    // <Button
    //   variant={isAlreadyLiked ? "contained" : "outlined"}
    //   color="primary"
    //   onClick={() => likeMutation(userId, item.id, isAlreadyLiked)}
    // >
    //   {isAlreadyLiked ? 'Liked' : 'Like'}
    // </Button>
  );
};

export default LikeButton;