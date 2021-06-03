import { Container } from '@material-ui/core';
import React, { useEffect } from 'react';
import NewPost from '../components/NewPost';
import { useCreatePostMutation, useHomePageLazyQuery, useGetUserPostsQuery } from '../generated/graphql';

interface Props {}

const Home: React.FC<Props> = () => {
  const [homePageQueryExecutor, { data: userData, loading }] = useHomePageLazyQuery({ fetchPolicy: 'network-only' });
  /* use the lazy query to prevent the "Can't perform a React state update on an unmounted component." error */
  // const  = useGetUserPostsQuery();
  const [createPost, { data: postData }] = useCreatePostMutation();

  useEffect(
    () => {
      homePageQueryExecutor();
      console.log('calling use effect');
      if (userData && userData.homePage) {
        // getUserPosts({
        //   variables: userData.homePage.id
        // });
      }
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (userData && userData.homePage) {
    console.log('userData', userData);
    if (postData) {
      console.log('post data', postData);
    }
    // if (postsData) {
    //   console.log('postss', postsData);
    // }
    return (
      <div>
        Welcome, {userData.homePage.firstName} {userData.homePage.lastName}
        <Container maxWidth="sm">
          <NewPost handleSubmit={handleSubmit} />
          {/* <Posts posts={} /> */}
        </Container>
      </div>
    );
  }

  return <div>Home</div>
}

export default Home;