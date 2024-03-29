import React, { ChangeEvent, useState } from 'react';
import { TextField } from '@material-ui/core';

interface Props {
  loading: boolean,
  handleCreateComment: (e: React.FormEvent, comment: string, callback: () => void) => Promise<void>
}

const CommentInput = ({ loading, handleCreateComment }: Props) => {
  const [comment, setComment] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  }

  const clearForm = () => {
    setComment('');
  };

  return (
    <form noValidate autoComplete="off" onSubmit={(e: React.FormEvent) => handleCreateComment(e, comment, clearForm)}>
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