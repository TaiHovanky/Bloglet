import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache } from '@apollo/client';
import Routes from './Routes';
import { getAccessToken } from './accessToken';
import './index.css';

const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql',
  credentials: 'include' // need this so that cookie gets set after login response
});

/**
 * is used to send the access token as a header with each request
 */
const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: {
        authorization: accessToken ? `Bearer ${accessToken}` : ''
      }
    });
  }
  return forward(operation)
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

/* ApolloProvider acts similar to React Context and passes the client connection
into all the child components */
ReactDOM.render(
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>,
  document.getElementById('root')
);
