import React from 'react';
import { Container, Typography } from '@material-ui/core';
import { useParams } from "react-router-dom";
import { useGetUserPostsQuery, useLikePostMutation } from '../generated/graphql';
import Posts from '../components/Posts';
import PrimaryAppBar from '../components/PrimaryAppBar';

const UserProfile: React.FC<any> = ({ location }) => {
  const { id } = useParams<{ id: string }>();
  const [likePost] = useLikePostMutation();

  const { data: postsData, loading: postsLoading } = useGetUserPostsQuery({
    variables: {
      userId: parseInt(id)
    }
  });

  const handleLikePost = (userId: number, postId: number) => {
    likePost({
      variables: {
        userId,
        postId
      }
    });
  }

  if (postsLoading) {
    return (
      <div>Loading user...</div>
    );
  }
  
  return (
    <div>
      <PrimaryAppBar />
      <Container fixed maxWidth="sm">
        {location && <Typography variant="h3">{`${location.state.user.firstName} ${location.state.user.lastName}`}</Typography>}
        {postsData && postsData.getUserPosts &&
          <Posts posts={postsData?.getUserPosts} likePost={handleLikePost} user={location.state.user} />
        }
      </Container>
    </div>
  );
};

export default UserProfile;