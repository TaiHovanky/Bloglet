import React, { useContext } from 'react';
import IconButton from '@material-ui/core/IconButton';
import { ThumbUp, ThumbUpOutlined } from '@material-ui/icons';
import { CommentLike, PostLike } from '../../generated/graphql';
import { LoggedInUserContext } from '../../pages/home';

interface Props {
  item: any;
  likeMutation: any
}

const LikeButton = ({ item, likeMutation}: Props) => {
  const loggedInUser = useContext(LoggedInUserContext);

  const isAlreadyLiked: boolean = item && item.likes ?
    item.likes.some((like: PostLike | CommentLike) => like.user && like.user.id === loggedInUser) : false;

  return (
    <IconButton
      color="primary"
      size="small"
      onClick={() => likeMutation(loggedInUser, item.id, isAlreadyLiked)}
    >
      {isAlreadyLiked ? <ThumbUp /> : <ThumbUpOutlined />}
    </IconButton>
  );
};

export default LikeButton;