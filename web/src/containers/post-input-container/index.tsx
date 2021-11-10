import React from 'react';
import PostInput from '../../components/post-input';
import { useMutation } from '@apollo/client';
import { CreatePostDocument, Post } from '../../generated/graphql';
import { readGetUserPostsQuery } from '../../utils/cache-modification.util';
import { currentGetUserPostsCursorVar, currentUserProfileVar } from '../../cache';

const PostInputContainer = () => {
  const [createPost] = useMutation(CreatePostDocument, {
    update(cache, data) {
      const posts: any = readGetUserPostsQuery(cache, currentUserProfileVar().id);
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

  const handleCreatePost = async (e: React.FormEvent, creatorId: number, callback: ()=> void): Promise<void> => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    currentGetUserPostsCursorVar(currentGetUserPostsCursorVar() + 1);
    await createPost({
      variables: {
        creatorId,
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