import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import NavBar from './pages/NavBar';

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    marginLeft: 240
  }
}));

const Routes = () => {
  const classes = useStyles();

  return (
    <BrowserRouter>
      <div>
        <header>
          <NavBar />
        </header>
        <main className={classes.content}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default Routes;
