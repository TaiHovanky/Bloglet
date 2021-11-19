import User from './types/user.interface';
import { InMemoryCache, makeVar, ReactiveVar } from '@apollo/client';
import { checkForDuplicateItems } from './utils/cache-modification.util';

export const currentUserProfileVar: ReactiveVar<User> = makeVar(new User(0, '', '', ''));
export const currentGetUserPostsCursorVar: ReactiveVar<number> = makeVar(0);
export const loggedInUserProfileVar: ReactiveVar<User> = makeVar(new User(0, '', '', ''));
export const isSwitchingBetweenHomeAndProfileVar = makeVar(false);

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
        loggedInUserProfileVar: {
          read() {
            return loggedInUserProfileVar();
          }
        },
        isSwitchingBetweenHomeAndProfile: {
          read() {
            return isSwitchingBetweenHomeAndProfileVar();
          }
        },
        getUserPosts: {
          keyArgs: ['type', 'id'],
          merge(existing = [], incoming, { args }) {
            console.log('existing incoming', existing, incoming, args, currentUserProfileVar());
            if (
              (args && args.userId !== currentUserProfileVar().id)
              || checkForDuplicateItems(existing, incoming)
              || (args && args.isGettingNewsfeed === true && isSwitchingBetweenHomeAndProfileVar() === true)
              // || (args && args.userId === currentUserProfileVar().id && isSwitchingBetweenHomeAndProfileVar() === true)
            ) {
              // If there are duplicate posts then default to returning the existing posts
              console.log('has dupes', existing, isSwitchingBetweenHomeAndProfileVar())
              return [...existing];
            }
            return existing && existing.length ? [...existing, ...incoming] : incoming;
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