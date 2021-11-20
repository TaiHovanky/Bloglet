import React from 'react';
import { Button, TextField, makeStyles, Paper, Container, Typography } from '@material-ui/core';
import { RouteComponentProps } from 'react-router';
import { useFormField } from '../../hooks/use-form-field.hook';
import { useLoginMutation } from '../../generated/graphql';
import { setAccessToken } from '../../accessToken';

const useStyles = makeStyles((theme) => ({
  loginPageContainer: {
    height: '100vh',
  },
  loginPaper: {
    width: '40%',
    margin: '0 auto',
    paddingBottom: theme.spacing(4),
    paddingTop: theme.spacing(4),
    marginTop: theme.spacing(32),
    paddingLeft: 48,
    paddingRight: 48
  },
  textField: {
    width: '100%'
  },
  submitBtn: {
    marginTop: theme.spacing(4)
  }
}));

const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const classes = useStyles();

  const email = useFormField('', 'email');
  const password = useFormField('', 'text');
  const [login] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const response = await login({
      variables: {
        email: formData.get('email') as string,
        password: formData.get('password') as string
      }
    });

    if (response && response.data) {
      setAccessToken(response.data.login.token);
    }

    history.push('/');
  }

  return (
    <div className={classes.loginPageContainer}>
      <Paper elevation={3} className={classes.loginPaper}>
        <Container maxWidth="md">
          <Typography variant="h3" noWrap>Log In</Typography>
          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <div>
              <TextField
                id="input-email"
                label="Email"
                name="email"
                className={classes.textField}
                {...email}
              />
            </div>
            <div>
              <TextField
                id="input-password"
                label="Password"
                type="password"
                name="password"
                className={classes.textField}
                {...password}
              />
            </div>
            <Button className={classes.submitBtn} variant="contained" color="primary" type="submit">Submit</Button>
          </form>
        </Container>
      </Paper>
    </div>
  );
}

export default Login;