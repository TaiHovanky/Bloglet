import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient, ApolloLink, createHttpLink, from } from '@apollo/client';
import { onError } from "@apollo/client/link/error";
import Routes from './Routes';
import { getAccessToken } from './accessToken';
import './index.css';
import cache from './cache';

const httpLink = createHttpLink({
  uri: 'server:3001',
  credentials: 'include' // need this so that cookie gets set after login response,
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
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
  link: from([authLink, errorLink, httpLink]),
  cache,
});

/* ApolloProvider acts similar to React Context and passes the client connection
into all the child components */
ReactDOM.render(
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>,
  document.getElementById('root')
);
