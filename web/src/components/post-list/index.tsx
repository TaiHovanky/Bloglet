import React from 'react';
import { Container } from '@material-ui/core';
import { GetUserPostsQuery, User } from '../../generated/graphql';
import Post from '../post';

interface Props {
  posts: GetUserPostsQuery['getUserPosts'],
  likePost: any,
  handleItemCreatorClick: (user: User) => void
}

const PostList: React.FC<Props> = ({
  posts,
  likePost,
  handleItemCreatorClick
}: Props) => {
  return (
    <Container maxWidth="sm">
      {!!posts ? posts.map((post: any) => (
        <Post
          key={`post-${post.id}`}
          post={post}
          likePost={likePost}
          handleItemCreatorClick={handleItemCreatorClick}
        />
      )) : []}
    </Container>
  );
};

export default PostList;