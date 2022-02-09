import React, { useState } from 'react';
import { Divider, Drawer, List, ListItem, ListItemText, makeStyles, IconButton } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import LogoutContainer from '../../containers/logout-container';

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
            <ListItem button>
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
          <LogoutContainer />
        </List>
      </Drawer>
    </>
  );
}

export default NavBar;