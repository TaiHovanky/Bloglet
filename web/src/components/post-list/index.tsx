import React from 'react';
import { Container } from '@material-ui/core';
import { GetUserPostsQuery } from '../../generated/graphql';
import Post from '../post';

interface Props {
  posts: GetUserPostsQuery['getUserPosts'],
  likePost: any,
}

const PostList: React.FC<Props> = ({
  likePost,
  posts,
}: Props) => {
  return (
    <Container maxWidth="sm">
      {!!posts ? posts.map((post: any) => (
        <Post
          key={post.id}
          post={post}
          likePost={likePost}
        />
      )) : []}
    </Container>
  )
};

export default PostList;