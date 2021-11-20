import { gql } from '@apollo/client';

const getIsSwitchingFromHomeToProfile = gql`
  query GetIsSwitchingFromHomeToProfile {
    isSwitchingFromHomeToProfile @client
  }
`;

export default getIsSwitchingFromHomeToProfile;