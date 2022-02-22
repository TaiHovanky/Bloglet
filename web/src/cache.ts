import User from './types/user.interface';
import { InMemoryCache, makeVar, ReactiveVar } from '@apollo/client';
import { checkForDuplicateItems } from './utils/cache-modification.util';

export const currentUserProfileVar: ReactiveVar<User> = makeVar(new User(0, '', '', ''));
export const currentGetUserPostsCursorVar: ReactiveVar<number> = makeVar(0);
export const loggedInUserProfileVar: ReactiveVar<User> = makeVar(new User(0, '', '', ''));

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
        getUserPosts: {
          keyArgs: ['type', 'id'],
          merge(existing = [], incoming = [], { args }) {
            if (
              existing &&
              existing.length &&
              (
                (args && args.userId !== currentUserProfileVar().id)
                || checkForDuplicateItems(existing, incoming)
              )
            ) {
              /* If the args.userId don't match the current user that's being viewed, return existing (instead of merging the incoming).
              This is so that you don't see posts from another user on a different user's profile page.
              If there are duplicate posts then default to returning the existing posts. */
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