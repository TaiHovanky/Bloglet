import React from 'react';
import PostInput from '../../components/post-input';
import { useMutation, useReactiveVar } from '@apollo/client';
import { CreatePostDocument, Post, User } from '../../generated/graphql';
import { readGetUserPostsQuery } from '../../utils/cache-modification.util';
import { currentGetUserPostsCursorVar, currentUserProfileVar, loggedInUserProfileVar } from '../../cache';

const PostInputContainer = () => {
  const loggedInUser: User = useReactiveVar(loggedInUserProfileVar);
  const currentUserProfile: User = useReactiveVar(currentUserProfileVar);
  const currentGetUserPostsCursor: number = useReactiveVar(currentGetUserPostsCursorVar);

  const [createPost] = useMutation(CreatePostDocument, {
    update(cache, data) {
      const posts: any = readGetUserPostsQuery(cache, currentUserProfile.id);
      cache.modify({
        fields: {
          getUserPosts() {
            return [data.data.createPost, ...posts.getUserPosts as Array<Post>];
          }
        }
      });
    } /* To avoid refetching, I can use the cache update function to add the Post instance
    that was returned by the mutation to the existing array of posts. While this takes more
    code, it's ultimately faster than refetching because there's not a network call. */
  });

  const handleCreatePost = async (e: React.FormEvent, callback: ()=> void): Promise<void> => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    currentGetUserPostsCursorVar(currentGetUserPostsCursor + 1);
    await createPost({
      variables: {
        creatorId: loggedInUser.id,
        content: formData.get('content') as string,
      }
    });
    callback(); // Used to clear the post form after saving a post
  }

  return (
    <PostInput handleCreatePost={handleCreatePost} />
  );
}

export default PostInputContainer;