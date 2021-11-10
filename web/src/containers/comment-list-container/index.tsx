import React from 'react';
import CommentList from '../../components/comment-list';
import { useMutation } from '@apollo/client';
import { currentUserProfileVar } from '../../cache';
import { LikeCommentDocument } from '../../generated/graphql';
import { readGetUserPostsQuery, updatePosts } from '../../utils/cache-modification.util';

interface Props {
  comments: Array<any>;
}

const CommentListContainer = ({ comments }: Props) => {
  const [likeComment] = useMutation(LikeCommentDocument, {
    update(cache, { data }) {
      const posts: any = readGetUserPostsQuery(cache, currentUserProfileVar().id);
      cache.modify({
        fields: {
          getUserPosts() {
            return updatePosts(posts.getUserPosts, 'comments', data.likeComment, true);
          }
        }
      })
    }
  });

  const handleLikeComment = (userId: number, commentId: number, isAlreadyLiked: boolean) => {
    likeComment({
      variables: {
        userId,
        commentId,
        isAlreadyLiked
      }
    });
  }

  return (
    <CommentList
      comments={comments}
      likeComment={handleLikeComment}
    />
  );
}

export default CommentListContainer;