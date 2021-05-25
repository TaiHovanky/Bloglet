import { Divider, Drawer, List, ListItem, ListItemText, makeStyles } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

const NavBar = () => {
  const classes = useStyles();
  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="left"
    >
      <div className={classes.toolbar} />
      <Divider />
      <List>
        <ListItem button>
          <ListItemText><Link to="/">Home</Link></ListItemText>
        </ListItem>
        <ListItem button>
          <ListItemText><Link to="/register">Register</Link></ListItemText>
        </ListItem>
        <ListItem button>
          <ListItemText><Link to="/login">Login</Link></ListItemText>
        </ListItem>
      </List>
    </Drawer>
  );
}

export default NavBar;