import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import './index.css';
import Routes from './Routes';

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql'
});

/* ApolloProvider acts similar to React Context and passes the client connection
into all the child components */
ReactDOM.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <Routes />
    </React.StrictMode>
  </ApolloProvider>,
  document.getElementById('root')
);
