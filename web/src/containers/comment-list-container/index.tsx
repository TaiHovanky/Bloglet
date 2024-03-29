import React from 'react';
import CommentList from '../../components/comment-list';
import { useMutation, useReactiveVar } from '@apollo/client';
import { currentUserProfileVar } from '../../cache';
import { LikeCommentDocument, User } from '../../generated/graphql';
import { readGetUserPostsQuery, updatePosts } from '../../utils/cache-modification.util';

interface Props {
  comments: Array<any>;
  handleItemCreatorClick: (user: User) => void
}

const CommentListContainer = ({ comments, handleItemCreatorClick }: Props) => {
  const currentUserProfile: User = useReactiveVar(currentUserProfileVar);

  const [likeComment] = useMutation(LikeCommentDocument, {
    update(cache, { data }) {
      const posts: any = readGetUserPostsQuery(cache, currentUserProfile.id);
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
      handleItemCreatorClick={handleItemCreatorClick}
    />
  );
}

export default CommentListContainer;