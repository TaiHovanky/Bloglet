import React, { ChangeEvent } from 'react';
import { TextField } from '@material-ui/core';
import { useMutation } from '@apollo/client';
import { CreateCommentDocument, GetUserPostsDocument } from '../../generated/graphql';
import { useState } from 'react';
import { currentUserProfileVar } from '../../cache';

interface Props {
  userId: number,
  postId: number
}

const CommentInput = ({ userId, postId }: Props) => {
  const [comment, setComment] = useState('');
  const [createComment, { loading }] = useMutation(CreateCommentDocument, {
    // onCompleted: (commentData) => {
    //   console.log('comment newly created', commentData);
    // }
    update(cache, { data }) {
      const posts: any = cache.readQuery({
        query: GetUserPostsDocument,
        variables: {
          userId: currentUserProfileVar().id
        }
      });
      console.log('updating after create comment', data, posts);
      cache.modify({
        fields: {
          getUserPosts(existingPost) {
            console.log('existing posts in cache mod', existingPost, posts);
            const updatedPosts = [...posts.getUserPosts];
            let updatedComments = [];
            let idx = 0;
            let updatedPost = {};
            updatedPosts.forEach((post, index) => {
              if (post.id === data.createComment.id) {
                updatedComments = data.createComment.comments
                idx = index;
                updatedPost = {...post, comments: updatedComments};
              }
            });
            updatedPosts.splice(idx, 1, updatedPost);
            console.log('updated posts', updatedPosts);
            return updatedPosts;
          }
        }
      })
    }
  });
    // , { refetchQueries: ['GetUserPosts']});

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