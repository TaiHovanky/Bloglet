import React from 'react';
import { Button, Container, makeStyles, Paper, TextField, Typography } from '@material-ui/core';
import { useFormField } from '../../hooks/use-form-field.hook';

interface Props {
  handleSubmit: (e: React.FormEvent) => Promise<void>
}

const useStyles = makeStyles((theme) => ({
  newPostPaper: {
    paddingBottom: theme.spacing(4),
    paddingTop: theme.spacing(4)
  },
  newPostTextField: {
    width: '100%'
  },
  submitBtn: {
    marginTop: theme.spacing(4)
  }
}));

const NewPostForm: React.FC<Props> = (props: Props) => {
  const classes = useStyles();
  const content = useFormField('', 'content');

  return (
    <Paper elevation={3} className={classes.newPostPaper}>
      <Container maxWidth="md">
        <Typography variant="h5" noWrap>Create Post</Typography>
        <form noValidate autoComplete="off" onSubmit={(e: React.FormEvent) => props.handleSubmit(e)}>
          <div>
            <TextField
              id="input-content"
              label="What's on your mind?"
              name="content"
              className={classes.newPostTextField}
              {...content}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className={classes.submitBtn}
          >
            Submit
          </Button>
        </form>
      </Container>
    </Paper>
  );
}

export default NewPostForm;