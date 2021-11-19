import React, { useState } from 'react';
import { Divider, Drawer, List, ListItem, ListItemText, makeStyles, IconButton } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import Logout from '../logout'
import { useLazyQuery, useMutation } from '@apollo/client';
import clearUserPosts from '../../cache-queries/clear-user-posts';
import { GetUserPostsDocument } from '../../generated/graphql';
import { loggedInUserProfileVar } from '../../cache';
import { OFFSET_LIMIT } from '../../hooks/use-scroll.hook';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#424242'
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  menuIcon: {
    fill: '#fff'
  },
  menuItemText: {
    fontWeight: 'bold',
    color: '#fff'
  }
}));

const NavBar = () => {
  const classes = useStyles();
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);

  const [clearPosts] = useMutation(clearUserPosts, {
    update(cache) {
      cache.modify({
        fields: {
          getUserPosts() {
            return [];
          }
        }
      });
    }
  });

  const [getUserPosts] = useLazyQuery(GetUserPostsDocument, {
    fetchPolicy: 'network-only',
    onError: (err) => console.log('get user posts lazy query error', err),
    onCompleted: (data) => console.log('lazy get user posts', data)
  });

  const toggleDrawer = (open: boolean) => {
    setIsNavDrawerOpen(open);
  };

  return (
    <>
      <IconButton onClick={() => toggleDrawer(true)}>
        <Menu className={classes.menuIcon} />
      </IconButton>
      <Drawer
        className={classes.drawer}
        open={isNavDrawerOpen}
        classes={{
          paper: classes.drawerPaper,
        }}
        onClose={() => toggleDrawer(false)}
        anchor="left"
      >
        <div className={classes.toolbar} />
        <Divider />
        <List>
          <Link to="/">
            <ListItem button>
              <ListItemText className={classes.menuItemText} primary="Home" />
            </ListItem>
          </Link>
          <Link to="/profile">
            <ListItem button 
              // onClick={() => {
              //   clearPosts();
              //   getUserPosts({
              //     variables: {
              //       userId: loggedInUserProfileVar().id,
              //       cursor: 0,
              //       offsetLimit: OFFSET_LIMIT,
              //       isGettingNewsfeed: false
              //     }
              //   });
              // }
            >
              <ListItemText className={classes.menuItemText} primary="Profile" />
            </ListItem>
          </Link>
          <Link to="/register">
            <ListItem button>
              <ListItemText className={classes.menuItemText} primary="Register" />
            </ListItem>
          </Link>
          <Link to="/login">
            <ListItem button>
              <ListItemText className={classes.menuItemText} primary="Login" />
            </ListItem>
          </Link>
          <Logout />
        </List>
      </Drawer>
    </>
  );
}

export default NavBar;