import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { fade, makeStyles } from '@material-ui/core/styles';
import { ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper } from '@material-ui/core';
import { User } from '../../generated/graphql';
import { currentGetUserPostsCursorVar, currentUserProfileVar } from '../../cache';
import NavBar from '../navbar';
import { OFFSET_LIMIT } from '../../hooks/use-scroll.hook';

interface Props {
  user?: User | null,
  searchUsers: any,
  getUserPosts: any,
  clearPosts: any,
  data?: any
}

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    marginBottom: 36
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  paper: {
    marginRight: theme.spacing(2)
  }
}));

const PrimaryAppBar = ({ user, getUserPosts, searchUsers, clearPosts, data }: Props) => {
  const classes = useStyles();

  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const anchorRef: any = useRef(null);

  useEffect(() => {
    searchUsers({
      variables: {
        name: value
      }
    });
  }, [value, searchUsers])

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMenuClick = (user: User) => {
    clearPosts();
    currentUserProfileVar({...user});
    currentGetUserPostsCursorVar(0);
    getUserPosts({
      variables: {
        userId: user.id,
        cursor: 0,
        offsetLimit: OFFSET_LIMIT
      }
    });
    handleClose();
  };

  function handleListKeyDown(event: any) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (data) {
      handleOpen();
    }
  };

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <NavBar />
          {user && <Typography className={classes.title} variant="h6" noWrap>
            Welcome, {`${user.firstName} ${user.lastName}`}
          </Typography>}
          {user && <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              onChange={handleChange}
              value={value}
              ref={anchorRef}
            />
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
              style={{
                zIndex: 2,
                width: anchorRef && anchorRef.current ? anchorRef.current.offsetWidth : 100
              }}
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList id="menu-list-grow" onKeyDown={handleListKeyDown}>
                        {data && data.searchUsers?.map(
                          (user: any, index: number) => (
                            <MenuItem key={index} onClick={() => handleMenuClick(user)}>
                              {user.firstName} {user.lastName}
                            </MenuItem>
                          )
                        )}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </div>}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default PrimaryAppBar;