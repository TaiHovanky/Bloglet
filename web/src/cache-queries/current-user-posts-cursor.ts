import { gql } from '@apollo/client';

const getCurrentGetUserPostsCursor = gql`
  query GetCurrentGetUserPostsCursor {
    currentGetUserPostsCursor @client
  }
`;

export default getCurrentGetUserPostsCursor;