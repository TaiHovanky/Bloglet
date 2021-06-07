import React, { useEffect } from 'react';
import { Container } from '@material-ui/core';
import NewPost from '../components/NewPost';
import Posts from '../components/Posts';
import { useCreatePostMutation, useHomePageLazyQuery, useGetUserPostsQuery } from '../generated/graphql';

interface Props {}

const Home: React.FC<Props> = () => {
  const [homePageQueryExecutor, { data: userData, loading }] = useHomePageLazyQuery({ fetchPolicy: 'network-only' });
  /* use the lazy query to prevent the "Can't perform a React state update on an unmounted component." error */

  const { data: postsData, loading: postsLoading } = useGetUserPostsQuery({
    variables: {
      userId: userData && userData.homePage && userData.homePage.id ? userData.homePage.id : 0
    },
    skip: !userData?.homePage?.id,
    onError: (err) => console.log(err),
    onCompleted: (x) => console.log(x, postsData)
  });

  const [createPost] = useCreatePostMutation();

  useEffect(
    () => {
      homePageQueryExecutor();
      console.log('calling use effect');
    },
    [homePageQueryExecutor]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    await createPost({
      variables: {
        creatorId: userData && userData.homePage ? userData.homePage.id : 0,
        title: formData.get('title') as string,
        body: formData.get('bodyText') as string
      }
    });
  }

  if (loading || postsLoading) {
    return <div>Loading...</div>;
  }

  if (userData && userData.homePage) {
    return (
      <div>
        Welcome, {userData.homePage.firstName} {userData.homePage.lastName}
        <Container maxWidth="sm">
          <NewPost handleSubmit={handleSubmit} />
          {postsData && postsData.getUserPosts && <Posts posts={postsData?.getUserPosts} />}
        </Container>
      </div>
    );
  }

  return <div>Home</div>
}

export default Home;