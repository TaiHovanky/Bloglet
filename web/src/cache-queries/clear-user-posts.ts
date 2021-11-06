import { gql } from '@apollo/client';

const clearUserPosts = gql`
  mutation clearPosts {
    getUserPosts @client
  }
`;

export default clearUserPosts;