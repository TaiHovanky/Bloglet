import React, { useEffect } from 'react';
import PostList from '../../components/post-list';
import { useMutation, useQuery } from '@apollo/client';
import { currentGetUserPostsCursorVar, currentUserProfileVar, isSwitchingBetweenHomeAndProfileVar } from '../../cache';
import { GetUserPostsDocument, LikePostDocument } from '../../generated/graphql';
import { OFFSET_LIMIT, SCROLL_DIRECTION_DOWN, useScrollDirection } from '../../hooks/use-scroll.hook';
import { readGetUserPostsQuery, updatePosts } from '../../utils/cache-modification.util';
import clearUserPosts from '../../cache-queries/clear-user-posts';

interface Props {
  isGettingNewsfeed: boolean;
}

const PostListContainer = ({ isGettingNewsfeed }: Props) => {
  const { data: postsData, loading: postsLoading, fetchMore } = useQuery(GetUserPostsDocument, {
    variables: {
      userId: currentUserProfileVar().id,
      cursor: currentGetUserPostsCursorVar(),
      offsetLimit: OFFSET_LIMIT,
      isGettingNewsfeed
    },
    skip: !currentUserProfileVar().id || isSwitchingBetweenHomeAndProfileVar() === true,
    onError: (err: any) => console.log('getting user posts error:', err),
    onCompleted: (d) => {
      console.log('get user posts', d, currentUserProfileVar(), isSwitchingBetweenHomeAndProfileVar());
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
          offsetLimit: OFFSET_LIMIT,
          isGettingNewsfeed
        }
      });
    }
  });

  const [clearPosts] = useMutation(clearUserPosts, {
    update(cache) {
      cache.modify({
        fields: {
          getUserPosts() {
            return [];
          }
        }
      });
    }
  });

  useEffect(
    () => {
      return function cleanupPostsList() {
        isSwitchingBetweenHomeAndProfileVar(true);
        clearPosts();
      }
    },
    [clearPosts]
  ); /* This calls the homePageQuery once to get the currently logged in user */


  if (postsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <PostList
      posts={postsData?.getUserPosts}
      likePost={handleLikePost}
    />
  );
}

export default PostListContainer;