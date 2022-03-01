import React from 'react';
import { Menu, MenuItem, IconButton } from '@material-ui/core';
import { MoreHoriz } from '@material-ui/icons';

interface Props {
  postId: number;
  deletePost: () => any;
}

const PostMenu = ({ postId, deletePost }: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    handleClose();
    deletePost();
  }

  return (
    <div>
      <IconButton size="small" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        <MoreHoriz />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleDelete}>Delete Post</MenuItem>
      </Menu>
    </div>
  );
};

export default PostMenu;