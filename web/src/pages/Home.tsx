import React, { useEffect } from 'react';
import { useHomePageLazyQuery } from '../generated/graphql';

interface Props {

}

const Home: React.FC<Props> = () => {
  const [homePageQueryExecutor, { data, loading }] = useHomePageLazyQuery({ fetchPolicy: 'network-only' });
  /* use the lazy query to prevent the "Can't perform a React state update on an unmounted component." error */

  useEffect(
    () => { homePageQueryExecutor(); },
    [homePageQueryExecutor]
  );

  if (loading || !data) {
    return <div>Loading...</div>;
  }

  if (data && data.homePage) {
    console.log('data', data);
    return (
      <div>
        Welcome, {data.homePage.firstName} {data.homePage.lastName}
      </div>
    );
  }

  return <div>Home</div>
}

export default Home;