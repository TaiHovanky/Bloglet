import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient, createHttpLink, from } from '@apollo/client';
import { onError } from "@apollo/client/link/error";
import Routes from './Routes';
import './index.css';
import cache from './cache';

const httpLink = createHttpLink({
  // Use IP address of droplet with the exposed port that server container runs on
  uri: 'http://159.223.122.194:3001/graphql',
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

const client = new ApolloClient({
  link: from([ errorLink, httpLink ]),
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
