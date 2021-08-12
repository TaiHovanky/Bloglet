import { InMemoryCache, makeVar, ReactiveVar } from '@apollo/client';
import User from './types/user.interface';

export const currentUserProfileVar: ReactiveVar<User> = makeVar(new User(0, '', '', ''));

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        currentUserProfile: {
          read() {
            return currentUserProfileVar();
          }
        },
      }
    },
    Post: {
      fields: {
        likes: {
          merge(existing, incoming) {
            return incoming;
          },
        }
      }
    }
  }
});

export default cache;