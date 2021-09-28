import { InMemoryCache, makeVar, ReactiveVar } from '@apollo/client';
import { Post } from './generated/graphql';
import User from './types/user.interface';
// import { offsetFromCursor } from './utils/pagination.util';

export const currentUserProfileVar: ReactiveVar<User> = makeVar(new User(0, '', '', ''));
export const currentGetUserPostsCursorVar: ReactiveVar<number> = makeVar(0);
export const currentOffsetLimitVar: ReactiveVar<number> = makeVar(5);

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
        currentOffsetLimit: {
          read() {
            return currentOffsetLimitVar();
          }
        },
        getUserPosts: {
          keyArgs: ['type', 'id'],
          merge(existing = [], incoming, { readField }) {
            // const merged = existing ? [...existing] : [];
            // let offset = offsetFromCursor(merged, cursor, readField);
            // if (offset < 0) {
            //   offset = merged.length;
            // }
            // for (let i = 0; i < incoming.length; ++i) {
            //   merged[offset + i] = incoming[i];
            // }
            // return merged;
            const postIdToIndex: any = {};
            if (existing.length) {
              existing.forEach((post: Post) => {
                const postId = readField('id', post);
                console.log('existing postid', postId);
                if (postId) {
                  postIdToIndex[postId?.toString()] = postId;
                }
              });
            }
            console.log('get user post cache existing incoming', existing, incoming, postIdToIndex);
            let shouldReturnExisting = false;
            incoming.forEach((post: Post) => {
              const incomingPostId = readField('id', post);
              if (incomingPostId && postIdToIndex[incomingPostId?.toString()]) {
                // console.log('incoming postid', incomingPostId, postIdToIndex[incomingPostId?.toString()]);
                // console.log('incoming post id exists');
                // return existing;
                shouldReturnExisting = true;
              }
            });
            if (shouldReturnExisting) {
              // console.log('should return existing', incoming);
              return incoming;
            }
            // if (existing.length) {
            //   console.log('existn len', existing.length + incoming.length);
            //   currentGetUserPostsCursorVar(existing.length + incoming.length);
            // } else {
            //   console.log('esle not exist', incoming.length);
            //   currentGetUserPostsCursorVar(incoming.length);
            // }
            console.log('about to return', existing, incoming);
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
            console.log('incoming comments', incoming, existing)
            let newIncoming: any = [...incoming];
            // if (incoming && Array.isArray(incoming)) {
            //   newIncoming = existing && existing.length ? [...incoming, ...existing] : [...incoming];
            // } else {
            //   newIncoming = [...existing];
            // }
            console.log('newincoming', newIncoming);
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