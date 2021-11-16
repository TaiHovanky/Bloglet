import User from './types/user.interface';
import { InMemoryCache, makeVar, ReactiveVar } from '@apollo/client';
import { checkForDuplicateItems } from './utils/cache-modification.util';

export const currentUserProfileVar: ReactiveVar<User> = makeVar(new User(0, '', '', ''));
export const currentGetUserPostsCursorVar: ReactiveVar<number> = makeVar(0);

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        currentUserProfile: {
          read() {
            return currentUserProfileVar();
          }
        },
        currentGetUserPostsCursor: {
          read() {
            return currentGetUserPostsCursorVar();
          }
        },
        getUserPosts: {
          keyArgs: ['type', 'id'],
          merge(existing = [], incoming) {
            if (checkForDuplicateItems(existing, incoming)) {
              // If there are duplicate posts then default to returning the existing posts
              return existing;
            }
            return existing.length ? [...existing, ...incoming] : incoming;
          }
        },
        getUserNewsfeed: {
          keyArgs: ['type', 'id'],
          merge(existing = [], incoming) {
            if (checkForDuplicateItems(existing, incoming)) {
              // If there are duplicate posts then default to returning the existing posts
              return existing;
            }
            return existing.length ? [...existing, ...incoming] : incoming;
          }
        },
        getFollowers: {
          merge(existing = [], incoming) {
            return incoming;
          }
        },
        getFollowing: {
          merge(existing = [], incoming) {
            return incoming;
          }
        }
      }
    },
    Post: {
      fields: {
        likes: {
          merge(existing, incoming) {
            return incoming;
          }
        },
        comments: {
          merge(existing, incoming) {
            let newIncoming: any = incoming ? [...incoming] : [];
            return newIncoming.sort((a: any, b: any) => {
              if (a.__ref > b.__ref) {
                return 1;
              }
              if (a.__ref < b.__ref) {
                return -1;
              }
              return 0;
            });
          }
        }
      }
    },
    Comment: {
      fields: {
        likes: {
          merge(existing, incoming) {
            return incoming;
          }
        }
      }
    }
  }
});

export default cache;