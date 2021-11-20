import { gql } from '@apollo/client';

const getIsSwitchingFromProfileToHome = gql`
  query GetIsSwitchingFromProfileToHome {
    isSwitchingFromProfileToHome @client
  }
`;

export default getIsSwitchingFromProfileToHome;