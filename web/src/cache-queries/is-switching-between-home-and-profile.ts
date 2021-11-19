import { gql } from '@apollo/client';

const getIsSwitchingBetweenHomeAndProfile = gql`
  query GetIsSwitchingBetweenHomeAndProfile {
    isSwitchingBetweenHomeAndProfile @client
  }
`;

export default getIsSwitchingBetweenHomeAndProfile;