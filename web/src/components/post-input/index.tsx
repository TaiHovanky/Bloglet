import React, { ChangeEvent, useState } from 'react';
import { Button, Container, makeStyles, Paper, TextField, Typography } from '@material-ui/core';
import { loggedInUserProfileVar } from '../../cache';
// import { LoggedInUserContext } from '../../pages/home';

interface Props {
  handleCreatePost: (e: React.FormEvent, creatorId: number, callback: () => void) => Promise<void>
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

const PostInput: React.FC<Props> = (props: Props) => {
  const classes = useStyles();
  const [postContent, setPostContent] = useState('');
  // const loggedInUser = useContext(LoggedInUserContext);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPostContent(e.target.value);
  };

  const clearForm = () => {
    setPostContent('');
  };

  return (
    <Paper elevation={3} className={classes.newPostPaper}>
      <Container maxWidth="md">
        <Typography variant="h5" noWrap>Create Post</Typography>
        <form noValidate autoComplete="off" onSubmit={(e: React.FormEvent) => props.handleCreatePost(e, loggedInUserProfileVar().id, clearForm)}>
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

export default PostInput;