import React from 'react';
import { Container } from '@material-ui/core';
import { GetUserPostsQuery } from '../../generated/graphql';
import Post from '../post';

interface Props {
  posts: GetUserPostsQuery['getUserPosts'],
  likePost: any,
  userId: number
}

const PostList: React.FC<Props> = ({
  likePost,
  posts,
  userId
}: Props) => {
  return (
    <Container maxWidth="sm">
      {!!posts ? posts.map((post: any) => (
        <Post
          key={post.id}
          post={post}
          userId={userId}
          likePost={likePost}
        />
      )) : []}
    </Container>
  )
};

export default PostList;