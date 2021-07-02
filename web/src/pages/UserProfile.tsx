import React from 'react';
import { Container, Typography } from '@material-ui/core';
import { useParams } from "react-router-dom";
import { useGetUserPostsQuery } from '../generated/graphql';
import Posts from '../components/Posts';
import PrimaryAppBar from '../components/PrimaryAppBar';

const UserProfile: React.FC<any> = ({ location }) => {
  const { id } = useParams<{ id: string }>();
  console.log('user id', id, location);
  const { data: postsData, loading: postsLoading } = useGetUserPostsQuery({
    variables: {
      userId: parseInt(id)
    }
  });

  if (postsLoading) {
    return (
      <div>Loading user...</div>
    );
  }
  
  return (
    <div>
      <PrimaryAppBar />
      <Container fixed maxWidth="sm">
        {location && <Typography variant="h3">{location.state.userName}</Typography>}
        {postsData && postsData.getUserPosts && <Posts posts={postsData?.getUserPosts} />}
      </Container>
    </div>
  );
};

export default UserProfile;