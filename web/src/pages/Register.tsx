import React, { useState } from 'react';
import { Button, TextField } from '@material-ui/core';

interface Props {

}

const Register: React.FC<Props> = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <form noValidate autoComplete="off">
      <TextField id="standard-basic" label="First Name" value={firstName} />
      <TextField id="standard-basic" label="Last Name" value={lastName} />
      <TextField id="standard-basic" label="Age" value={age} />
      <TextField id="standard-basic" label="Email" value={email} />
      <TextField id="standard-basic" label="Password" type="password" value={password} />
      <Button variant="contained" color="primary" type="submit">Submit</Button>
    </form>
  );
}

export default Register;