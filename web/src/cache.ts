import { InMemoryCache, makeVar, ReactiveVar, StoreObject } from '@apollo/client';
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
            if (existing && existing.length) {
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
            return existing && existing.length ? [...existing, ...incoming] : incoming;
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
          merge(existing, incoming, { readField }) {
            // const newIncoming = [...incoming];
            // return newIncoming.sort((a: any, b: any) => {
            //   if (a.__ref > b.__ref) {
            //     return 1;
            //   }
            //   if (a.__ref < b.__ref) {
            //     return -1;
            //   }
            //   return 0;
            // });
            // ^ old sorted comments code

            const commentIdToIndex: any = {};
            if (existing && existing.length) {
              existing.forEach((comment: StoreObject) => {
                const commentId = readField('id', comment);
                console.log('existing commentid', commentId);
                if (commentId) {
                  commentIdToIndex[commentId?.toString()] = commentId;
                }
              });
            }
            console.log('get user post cache existing incoming after comment', existing, incoming, commentIdToIndex);
            let shouldReturnExisting = false;
            incoming.forEach((comment: Post) => {
              const incomingCommentId = readField('id', comment);
              if (incomingCommentId && commentIdToIndex[incomingCommentId?.toString()]) {
                shouldReturnExisting = true;
              }
            });
            if (shouldReturnExisting) {
              return incoming;
            }
            console.log('about to return comments', existing, incoming);
            return existing && existing.length ? [...existing, ...incoming] : incoming;
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