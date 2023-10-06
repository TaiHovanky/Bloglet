import React from 'react';
import {
  Menu,
  MenuItem,
  MenuProps,
  IconButton,
  ListItemIcon,
  ListItemText,
  withStyles
} from '@material-ui/core';
import { MoreHoriz, Delete } from '@material-ui/icons';


interface Props {
  postId: number;
  deletePost: () => any;
}


const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));


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
    <>
      <IconButton size="small" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        <MoreHoriz />
      </IconButton>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Delete Post" />
        </MenuItem>
      </StyledMenu>
    </>
  );
};


export default PostMenu;