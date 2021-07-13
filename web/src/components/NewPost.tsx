import React from 'react';
import { Button, Container, makeStyles, Paper, TextField, Typography } from '@material-ui/core';
import { useFormField } from '../hooks/useFormField';

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

const NewPost: React.FC<Props> = (props: Props) => {
  const classes = useStyles();
  const title = useFormField('', 'title');
  const bodyText = useFormField('', 'title');

  return (
    <Paper elevation={3} className={classes.newPostPaper}>
      <Container maxWidth="md">
        <Typography variant="h3" noWrap>Create a new post</Typography>
        <form noValidate autoComplete="off" onSubmit={(e: React.FormEvent) => props.handleSubmit(e)}>
          <div>
            <TextField
              id="input-title"
              label="Title"
              name="title"
              className={classes.newPostTextField}
              {...title}
            />
          </div>
          <div>
            <TextField
              id="input-bodyText"
              label="Content"
              name="bodyText"
              className={classes.newPostTextField}
              {...bodyText}
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

export default NewPost;