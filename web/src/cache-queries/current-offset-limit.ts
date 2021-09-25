import { gql } from "@apollo/client";

const getCurrentOffsetLimit = gql`
  query currentOffsetLimit {
    currentOffsetLimit @client
  }
`;

export default getCurrentOffsetLimit;