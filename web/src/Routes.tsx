import './App.css';
import { Router, Route, Switch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import {createBrowserHistory}  from 'history';
import Home from './pages/home';
import Register from './pages/register';
import Login from './pages/login';
import Profile from './pages/profile';
import PrimaryAppBarContainer from './containers/primary-app-bar-container';

const history = createBrowserHistory();

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
  }
}));

const Routes = () => {
  const classes = useStyles();

  return (
    <Router history={history}>
      <main className={classes.content}>
        <PrimaryAppBarContainer />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
        </Switch>
      </main>
    </Router>
  );
}

export default Routes;
