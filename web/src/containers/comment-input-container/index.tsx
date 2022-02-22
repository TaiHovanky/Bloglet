import React from 'react';
import { useMutation, useReactiveVar } from '@apollo/client';
import { currentUserProfileVar, loggedInUserProfileVar } from '../../cache';
import { readGetUserPostsQuery, updatePosts } from '../../utils/cache-modification.util';
import { CreateCommentDocument, User } from '../../generated/graphql';
import CommentInput from '../../components/comment-input';

interface Props {
  postId: number
}

const CommentInputContainer = ({ postId }: Props) => {
  const loggedInUser: User = useReactiveVar(loggedInUserProfileVar);
  const currentUserProfile: User = useReactiveVar(currentUserProfileVar);

  const [createComment, { loading }] = useMutation(CreateCommentDocument, {
    update(cache, { data }) {
      const posts: any = readGetUserPostsQuery(cache, currentUserProfile.id);
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
        userId: loggedInUser.id,
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