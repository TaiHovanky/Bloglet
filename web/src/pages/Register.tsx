import React from 'react';
import { Button, Container, makeStyles, Paper, TextField, Typography } from '@material-ui/core';
import { RouteComponentProps } from 'react-router';
import { useRegisterMutation } from '../generated/graphql';
import { useFormField } from '../hooks/useFormField';

const useStyles = makeStyles((theme) => ({
  registerPageContainer: {
    paddingTop: '1px',
    height: '100vh',
  },
  registerPaper: {
    margin: theme.spacing(32),
    paddingBottom: theme.spacing(4),
    paddingTop: theme.spacing(4)
  },
  submitBtn: {
    marginTop: theme.spacing(4)
  }
}));

const Register: React.FC<RouteComponentProps> = ({ history }) => {
  const classes = useStyles();

  const firstName = useFormField('', 'text');
  const lastName = useFormField('', 'text');
  const email = useFormField('', 'email');
  const password = useFormField('', 'text');

  const [register] = useRegisterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const response = await register({
      variables: {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string
      }
    });
    console.log('response', response);
    history.push('/');
  };

  return (
    <div className={classes.registerPageContainer}>
      <Paper elevation={3} className={classes.registerPaper}>
        <Container maxWidth="md">
          <Typography variant="h3" noWrap>Sign Up</Typography>
          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <div>
              <TextField
                id="input_firstName"
                label="First Name"
                name="firstName"
                {...firstName}
              />
            </div>
            <div>
              <TextField
                id="input_lastName"
                label="Last Name"
                name="lastName"
                {...lastName}
              />
            </div>
            <div>
              <TextField
                id="input_email"
                label="Email"
                name="email"
                {...email}
              />
            </div>
            <div>
              <TextField
                id="input_password"
                label="Password"
                type="password"
                name="password"
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

export default Register;