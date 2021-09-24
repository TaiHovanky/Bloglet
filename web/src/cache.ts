import { InMemoryCache, makeVar, ReactiveVar } from '@apollo/client';
import User from './types/user.interface';
// import { offsetFromCursor } from './utils/pagination.util';

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
          keyArgs: ['type'],
          merge(existing, incoming) {
            // const merged = existing ? [...existing] : [];
            // let offset = offsetFromCursor(merged, cursor, readField);
            // if (offset < 0) {
            //   offset = merged.length;
            // }
            // for (let i = 0; i < incoming.length; ++i) {
            //   merged[offset + i] = incoming[i];
            // }
            // return merged;
            console.log('get user post cache existing incoming', existing, incoming);
            if (existing && existing.length) {
              currentGetUserPostsCursorVar(existing.length + incoming.length);
            } else {
              currentGetUserPostsCursorVar(incoming.length);
            }
            return existing ? [...existing, ...incoming] : incoming;
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
            const newIncoming = [...incoming];
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