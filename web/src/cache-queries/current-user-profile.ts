import { gql } from "@apollo/client";

const getCurrentUserProfile = gql`
  query GetCurrentUserProfile {
    currentUserProfile @client {
      id
      email
      firstName
      lastName
    }
  }
`;

export default getCurrentUserProfile;