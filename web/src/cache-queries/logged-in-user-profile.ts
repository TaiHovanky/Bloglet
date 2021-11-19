import { gql } from '@apollo/client';

const getLoggedInUserProfile = gql`
  query GetLoggedInUserProfile {
    loggedInUserProfile @client {
      id
      email
      firstName
      lastName
    }
  }
`;

export default getLoggedInUserProfile;