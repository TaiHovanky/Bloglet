import React from 'react';
import getCurrentUserProfile from '../../cache-queries/current-user-profile';
import getCurrentGetUserPostsCursor from '../../cache-queries/current-user-posts-cursor';
import PostList from '../../components/post-list';
import { useMutation, useQuery } from '@apollo/client';
import { currentGetUserPostsCursorVar, currentUserProfileVar } from '../../cache';
import { LikePostDocument, useGetUserPostsQuery } from '../../generated/graphql';
import { OFFSET_LIMIT, SCROLL_DIRECTION_DOWN, useScrollDirection } from '../../hooks/use-scroll.hook';
import { readGetUserPostsQuery, updatePosts } from '../../utils/cache-modification.util';

const PostListContainer = () => {
  // eslint-disable-next-line
  const currentUserProfile = useQuery(getCurrentUserProfile);
  // eslint-disable-next-line
  const currentGetUserPostsCursor = useQuery(getCurrentGetUserPostsCursor);

  const { data: postsData, loading: postsLoading, fetchMore } = useGetUserPostsQuery({
    variables: {
      userId: currentUserProfileVar().id,
      cursor: currentGetUserPostsCursorVar(),
      offsetLimit: OFFSET_LIMIT
    },
    skip: !currentUserProfileVar().id,
    onError: (err: any) => console.log(err),
    onCompleted: (data: any) => {
      console.log('dataaaaaaa', data);
    }
  });

  const [likePost] = useMutation(LikePostDocument, {
    update(cache, { data }) {
      const posts: any = readGetUserPostsQuery(cache, currentUserProfileVar().id);
      cache.modify({
        fields: {
          getUserPosts() {
            return updatePosts(posts.getUserPosts, 'likes', data.likePost, false);
          }
        }
      })
    }
  });

  const handleLikePost = (userId: number, postId: number, isAlreadyLiked: boolean) => {
    likePost({
      variables: {
        userId,
        postId,
        isAlreadyLiked
      }
    });
  }

  useScrollDirection(async (scrollDirection: string) => {
    if (
      scrollDirection === SCROLL_DIRECTION_DOWN &&
      window.scrollY + window.innerHeight > document.documentElement.scrollHeight - 2 &&
      !postsLoading &&
      postsData &&
      postsData.getUserPosts &&
      postsData.getUserPosts.length
    ) {
      currentGetUserPostsCursorVar(currentGetUserPostsCursorVar() + OFFSET_LIMIT)
      await fetchMore({
        variables: {
          userId: currentUserProfileVar().id,
          cursor: currentGetUserPostsCursorVar(),
          offsetLimit: OFFSET_LIMIT
        }
      });
    }
  });

  if (postsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <PostList
      posts={postsData?.getUserPosts}
      likePost={handleLikePost}
      userId={currentUserProfileVar().id}
    />
  );
}

export default PostListContainer;