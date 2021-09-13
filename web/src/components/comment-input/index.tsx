import React, { ChangeEvent } from 'react';
import { TextField } from '@material-ui/core';
import { useMutation } from '@apollo/client';
import { CreateCommentDocument } from '../../generated/graphql';
import { useState } from 'react';

interface Props {
  userId: number,
  postId: number
}

const CommentInput = ({ userId, postId }: Props) => {
  const [comment, setComment] = useState('');
  const [createComment, { loading }] = useMutation(CreateCommentDocument);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    createComment({
      variables: {
        comment,
        userId,
        postId,
        createdAt: new Date().toLocaleString()
      },
    });
    setComment('');
  }

  return (
    <form noValidate autoComplete="off" onSubmit={handleSubmit}>
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