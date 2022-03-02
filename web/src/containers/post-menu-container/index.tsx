import React from 'react';
import { useMutation, useReactiveVar } from '@apollo/client';
import PostMenu from '../../components/post-menu';
import { DeletePostDocument, User, Post } from '../../generated/graphql';
import { currentUserProfileVar } from '../../cache';
import { readGetUserPostsQuery } from '../../utils/cache-modification.util';

interface Props {
  postId: number;
}

const PostMenuContainer = ({ postId }: Props) => {
  const currentUserProfile: User = useReactiveVar(currentUserProfileVar);

  const [deletePost] = useMutation(DeletePostDocument, {
    variables: {
      postId
    },
    update(cache) {
      const posts: any = readGetUserPostsQuery(cache, currentUserProfile.id);
      cache.modify({
        fields: {
          getUserPosts() {
            return posts.getUserPosts.filter((post: Post) => post.id !== postId) as Array<Post>
          }
        }
      })
    }
  });

  return (
    <PostMenu deletePost={deletePost} postId={postId} />
  );
}

export default PostMenuContainer;