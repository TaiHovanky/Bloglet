import { InMemoryCache, makeVar, ReactiveVar } from '@apollo/client';
// import { Post } from './generated/graphql';
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
    //         // const merged = existing ? [...existing] : [];
    //         // let offset = offsetFromCursor(merged, cursor, readField);
    //         // if (offset < 0) {
    //         //   offset = merged.length;
    //         // }
    //         // for (let i = 0; i < incoming.length; ++i) {
    //         //   merged[offset + i] = incoming[i];
    //         // }
    //         // return merged;
    //         const postIdToIndex: any = {};
    //         if (existing.length) {
    //           existing.forEach((post: Post) => {
    //             const postId = readField('id', post);
    //             console.log('existing postid', postId);
    //             if (postId) {
    //               postIdToIndex[postId?.toString()] = postId;
    //             }
    //           });
    //         }
    //         // console.log('get user post cache existing incoming', existing, incoming, postIdToIndex);
    //         let shouldReturnExisting = false;
    //         incoming.forEach((post: Post) => {
    //           const incomingPostId = readField('id', post);
    //           if (incomingPostId && postIdToIndex[incomingPostId?.toString()]) {
    //             // console.log('incoming postid', incomingPostId, postIdToIndex[incomingPostId?.toString()]);
    //             // console.log('incoming post id exists');
    //             // return existing;
    //             shouldReturnExisting = true;
    //           }
    //         });
    //         if (shouldReturnExisting) {
    //           console.log('should return existing', incoming);
    //           return incoming;
    //         }
            // let newIncoming = [];
            // let uniqueExisting = [];
            if (existing.length) {
              
              // console.log('incoming', incoming, existing);
              // uniqueExisting = existing.filter((post: any, postIdx: number) => {
              //   const x = existing.findIndex((existpost: any) => {
              //     console.log('exist post', existpost, post);
              //     return existpost.__ref === post.__ref || existpost.id === post.id;
              //   });
              //   console.log('xxxxxx', x, postIdx);
              //   return x === postIdx;
              // })
              // newIncoming = incoming.filter((post: any) => {
              //   return !existing.find((existingPost: any) => existingPost.__ref === post.__ref);
              // });
              
    //         //   console.log('existn len', existing.length + incoming.length);
    //         //   currentGetUserPostsCursorVar(existing.length + incoming.length);
    //         // } else {
    //         //   console.log('esle not exist', incoming.length);
    //         //   currentGetUserPostsCursorVar(incoming.length);
            }
            console.log('about to return', incoming, existing);
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
            // console.log('newincoming', newIncoming, existing);
            const res = newIncoming.sort((a: any, b: any) => {
              if (a.__ref > b.__ref) {
                return 1;
              }
              if (a.__ref < b.__ref) {
                return -1;
              }
              return 0;
            });
            console.log('res', res);
            return res;
          }
        }
      }
    },
    Comment: {
      fields: {
        likes: {
          merge(existing, incoming) {
            // console.log('comment cache', existing, incoming);
            return incoming;
          }
        }
      }
    }
  }
});

export default cache;