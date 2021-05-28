import React from 'react';
import { Button, TextField } from '@material-ui/core';
import { RouteComponentProps } from 'react-router';
import { useFormField } from '../hooks/useFormField';
import { useLoginMutation } from '../generated/graphql';
import { setAccessToken } from '../accessToken';

const Login: React.FC<RouteComponentProps> = ({ history }) => {
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
    console.log('response', response);
    history.push('/');
  }

  return (
    <form noValidate autoComplete="off" onSubmit={handleSubmit}>
      <TextField
        id="standard-basic"
        label="Email"
        name="email"
        {...email}
      />
      <TextField
        id="standard-basic"
        label="Password"
        type="password"
        name="password"
        {...password}
      />
      <Button variant="contained" color="primary" type="submit">Submit</Button>
    </form>
  );
}

export default Login;