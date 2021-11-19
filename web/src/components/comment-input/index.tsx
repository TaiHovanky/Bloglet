import React, { ChangeEvent, useState } from 'react';
import { TextField } from '@material-ui/core';
import { loggedInUserProfileVar } from '../../cache';
// import { LoggedInUserContext } from '../../pages/home';

interface Props {
  loading: boolean,
  handleCreateComment: (e: React.FormEvent, comment: string, creatorId: number, callback: () => void) => Promise<void>
}

const CommentInput = ({ loading, handleCreateComment }: Props) => {
  const [comment, setComment] = useState('');
  // const loggedInUser = useContext(LoggedInUserContext);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  }

  const clearForm = () => {
    setComment('');
  };

  return (
    <form noValidate autoComplete="off" onSubmit={(e: React.FormEvent) => handleCreateComment(e, comment, loggedInUserProfileVar().id, clearForm)}>
      <div>
        <TextField
          label="Comment"
          name="comment"
          fullWidth
          disabled={loading}
          value={comment}
          onChange={handleChange}
        />
      </div>
    </form>
  );
};

export default CommentInput;