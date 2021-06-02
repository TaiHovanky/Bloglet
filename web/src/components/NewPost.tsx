import React from 'react';
import { Button, TextField } from '@material-ui/core';
import { useFormField } from '../hooks/useFormField';

interface Props {
  handleSubmit: (e: React.FormEvent) => Promise<void>
}

const NewPost: React.FC<Props> = (props: any) => {
  const title = useFormField('', 'title');
  const bodyText = useFormField('', 'title');

  return (
    <form noValidate autoComplete="off" onSubmit={(e: React.FormEvent) => props.handleSubmit(e)}>
      <TextField
        id="input-title"
        label="Title"
        name="title"
        {...title}
      />
      <TextField
        id="input-bodyText"
        label="Content"
        type="bodyText"
        name="bodyText"
        {...bodyText}
      />
      <Button variant="contained" color="primary" type="submit">Submit</Button>
    </form>
  );
}

export default NewPost;