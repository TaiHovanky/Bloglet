import React, { ChangeEvent, useState } from 'react';
import { Button, Container, makeStyles, Paper, TextField, Typography } from '@material-ui/core';
// import { currentUserProfileVar } from '../../cache';

interface Props {
  handleSubmit: (e: React.FormEvent, callback: () => void) => Promise<void>,
  refetch: any,
  postsLength: number | undefined
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
  const [postContent, setPostContent] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPostContent(e.target.value);
  };

  const clearForm = () => {
    setPostContent('');
    // setTimeout(function () {
    //   props.refetch({
    //     variables: {
    //       userId: currentUserProfileVar().id,
    //       cursor: 0,
    //       offsetLimit: props.postsLength ? props.postsLength + 1 : 5
    //     }
    //   });
    // }, 3500);
  };

  return (
    <Paper elevation={3} className={classes.newPostPaper}>
      <Container maxWidth="md">
        <Typography variant="h5" noWrap>Create Post</Typography>
        <form noValidate autoComplete="off" onSubmit={(e: React.FormEvent) => props.handleSubmit(e, clearForm)}>
          <div>
            <TextField
              id="input-content"
              label="What's on your mind?"
              name="content"
              multiline
              className={classes.newPostTextField}
              value={postContent}
              onChange={handleChange}
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