import React, { ChangeEvent } from 'react';
import { TextField } from '@material-ui/core';
import { useMutation } from '@apollo/client';
import { Comment, CreateCommentDocument, GetUserPostsDocument, Post } from '../../generated/graphql';
import { useState } from 'react';

interface Props {
  userId: number,
  postId: number
}

const CommentInput = ({ userId, postId }: Props) => {
  const [comment, setComment] = useState('');
  const [createComment, { loading }] = useMutation(CreateCommentDocument, {
    update(cache, data) {
      if (data && data.data && data.data.createComment) {
        const userPosts: any = cache.readQuery({
          query: GetUserPostsDocument,
          variables: {
            userId
          }
        });
        const newUserPosts = userPosts.getUserPosts.map((post: Post) => {
          const newPost = {...post};
          if (newPost.id === data.data.createComment.post.id) {
            newPost.comments = [...newPost.comments as Array<Comment>, data.data.createComment]
          }
          return newPost;
        });
        cache.modify({
          fields: {
            getUserPosts(existingPosts: Array<Post>) {
              return newUserPosts;
            }
          }
        })
      }
    }
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log('submitted', comment, userId, postId);
    createComment({
      variables: {
        comment,
        userId,
        postId,
        createdAt: new Date().toLocaleString()
      },
    }).then((data) => {
      console.log('data', data);
    });
  }

  return (
    <form noValidate autoComplete="off" onSubmit={handleSubmit}>
      <div>
        <TextField
          label="Comment"
          name="comment"
          disabled={loading}
          value={comment}
          onChange={handleChange}
        />
      </div>
    </form>
  );
};

export default CommentInput;