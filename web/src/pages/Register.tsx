import React from 'react';
import { Button, TextField } from '@material-ui/core';
import { RouteComponentProps } from 'react-router';
import { useRegisterMutation } from '../generated/graphql';
import { useFormField } from '../hooks/useFormField';

const Register: React.FC<RouteComponentProps> = ({ history }) => {
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
    <form noValidate autoComplete="off" onSubmit={handleSubmit}>
      <TextField
        id="input_firstName"
        label="First Name"
        name="firstName"
        {...firstName}
      />
      <TextField
        id="input_lastName"
        label="Last Name"
        name="lastName"
        {...lastName}
      />
      <TextField
        id="input_email"
        label="Email"
        name="email"
        {...email}
      />
      <TextField
        id="input_password"
        label="Password"
        type="password"
        name="password"
        {...password}
      />
      <Button variant="contained" color="primary" type="submit">Submit</Button>
    </form>
  );
}

export default Register;