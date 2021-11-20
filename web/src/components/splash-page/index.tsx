import React from 'react';
import { Container, makeStyles, Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  homePaper: {
    margin: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    paddingTop: theme.spacing(4)
  },
  homePageText: {
    marginTop: theme.spacing(4)
  }
}));

const SplashPage = () => {
  const classes = useStyles();

  return (
    <>
      <Paper elevation={3} className={classes.homePaper}>
        <Container maxWidth="md">
          <Typography className={classes.homePageText} variant="h3">Welcome to my practice social media app</Typography>
          <Typography className={classes.homePageText} variant="h5">Share your musings with the world through blog posts</Typography>
          <Typography className={classes.homePageText} variant="h5">To get started, register yourself as a user or login with an existing account</Typography>
        </Container>
      </Paper>
    </>
  );
}

export default SplashPage;