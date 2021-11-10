import React from 'react';
import { useMutation } from '@apollo/client';
import { currentUserProfileVar } from '../../cache';
import { readGetUserPostsQuery, updatePosts } from '../../utils/cache-modification.util';
import { CreateCommentDocument } from '../../generated/graphql';
import CommentInput from '../../components/comment-input';

interface Props {
  userId: number,
  postId: number
}

const CommentInputContainer = ({ userId, postId }: Props) => {
  const [createComment, { loading }] = useMutation(CreateCommentDocument, {
    update(cache, { data }) {
      const posts: any = readGetUserPostsQuery(cache, currentUserProfileVar().id);
      cache.modify({
        fields: {
          getUserPosts() {
            return updatePosts(posts.getUserPosts, 'comments', data.createComment, false);
          }
        }
      })
    }
  });

  const handleCreateComment = async (e: React.FormEvent, comment: string, callback: ()=> void): Promise<void> => {
    e.preventDefault();
    await createComment({
      variables: {
        comment,
        userId,
        postId,
        createdAt: new Date().toLocaleString()
      },
    });
    callback();
  }

  return (
    <CommentInput
      loading={loading}
      handleCreateComment={handleCreateComment}
    />
  );
}

export default CommentInputContainer;