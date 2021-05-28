import React, { useState } from 'react';
import { useHomePageQuery } from '../generated/graphql';

interface Props {

}

const Home: React.FC<Props> = () => {
  const { data, loading } = useHomePageQuery({ fetchPolicy: 'network-only' });
  if (loading) {
    return <div>loading...</div>;
  }

  if (data && data.homePage) {
    console.log('data', data);
  }
  return (
    <div>
      Home
    </div>
  );
}

export default Home;