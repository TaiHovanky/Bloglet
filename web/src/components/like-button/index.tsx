import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import { ThumbUp, ThumbUpOutlined } from '@material-ui/icons';

interface Props {
  isAlreadyLiked: boolean
  handleLikeButtonClick: () => void
}

const LikeButton = ({ isAlreadyLiked, handleLikeButtonClick}: Props) => {
  return (
    <IconButton
      color="primary"
      size="small"
      onClick={handleLikeButtonClick}
    >
      {isAlreadyLiked ? <ThumbUp /> : <ThumbUpOutlined />}
    </IconButton>
  );
};

export default LikeButton;