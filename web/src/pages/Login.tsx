import React, { useState } from 'react';
import { Button, TextField } from '@material-ui/core';

interface Props {

}

const Login: React.FC<Props> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <form noValidate autoComplete="off">
      <TextField id="standard-basic" label="Email" value={email} />
      <TextField id="standard-basic" label="Password" type="password" value={password} />
      <Button variant="contained" color="primary" type="submit">Submit</Button>
    </form>
  );
}

export default Login;