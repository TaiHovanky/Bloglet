import React, { useState } from 'react';
import {
  Button,
  Container,
  makeStyles,
  Paper,
  TextField,
  Typography,
  Snackbar
} from '@material-ui/core';
import { RouteComponentProps } from 'react-router';
import { useRegisterMutation } from '../../generated/graphql';
import { useFormField } from '../../hooks/use-form-field.hook';

const useStyles = makeStyles((theme) => ({
  registerPageContainer: {
    height: '100vh',
  },
  registerPaper: {
    width: '40%',
    margin: '0 auto',
    paddingBottom: theme.spacing(4),
    paddingTop: theme.spacing(4),
    marginTop: theme.spacing(24),
    paddingLeft: 48,
    paddingRight: 48
  },
  textField: {
    width: '100%'
  },
  submitBtn: {
    marginTop: theme.spacing(4)
  },
  errorAlert: {
    width: '100%',
    backgroundColor: '#D84646',
    color: 'white',
    paddingBottom: 12,
    paddingTop: 12,
    paddingLeft: 48,
    paddingRight: 48,
    display: 'flex'
  }
}));

const Register: React.FC<RouteComponentProps> = ({ history }) => {
  const classes = useStyles();

  const firstName = useFormField('', 'text');
  const lastName = useFormField('', 'text');
  const email = useFormField('', 'email');
  const password = useFormField('', 'text');

  const [errors, setErrors] = useState('');

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

    if (response && response.data && response.data.register.user) {
      history.push('/');
    } else if (response && response.data && response.data.register.errors) {
      setErrors(response.data.register.errors[0].message);
    }
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
                className={classes.textField}
                {...firstName}
              />
            </div>
            <div>
              <TextField
                id="input_lastName"
                label="Last Name"
                name="lastName"
                className={classes.textField}
                {...lastName}
              />
            </div>
            <div>
              <TextField
                id="input_email"
                label="Email"
                name="email"
                className={classes.textField}
                {...email}
              />
            </div>
            <div>
              <TextField
                id="input_password"
                label="Password"
                type="password"
                name="password"
                className={classes.textField}
                {...password}
              />
            </div>
            <Button className={classes.submitBtn} variant="contained" color="primary" type="submit">Submit</Button>
          </form>
          <Snackbar open={!!errors && !!errors.length}>
            <Paper variant="elevation" className={classes.errorAlert}>
              <Typography variant="h6">{errors}</Typography>
            </Paper>
          </Snackbar>
        </Container>
      </Paper>
    </div>
  );
}

export default Register;