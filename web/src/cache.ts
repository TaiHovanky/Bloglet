import { InMemoryCache, makeVar, ReactiveVar } from '@apollo/client';
import User from './types/user.interface';

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
          keyArgs: ['type', 'id', '__ref'],
          merge(existing = [], incoming) {
            console.log('getUserPosts cache', existing, incoming);
            if (currentGetUserPostsCursorVar() === 0) {
              console.log('returning incoming', currentGetUserPostsCursorVar(), incoming);
              return incoming;
            }
            return existing.length ? [...existing, ...incoming] : incoming;
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