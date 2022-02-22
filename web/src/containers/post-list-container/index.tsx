import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import PostList from '../../components/post-list';
import { currentGetUserPostsCursorVar, currentUserProfileVar } from '../../cache';
import { GetUserPostsDocument, LikePostDocument, User } from '../../generated/graphql';
import { OFFSET_LIMIT, SCROLL_DIRECTION_DOWN, useScrollDirection } from '../../hooks/use-scroll.hook';
import { readGetUserPostsQuery, updatePosts } from '../../utils/cache-modification.util';
import clearUserPosts from '../../cache-queries/clear-user-posts';

interface Props {
  isGettingNewsfeed: boolean;
}

const PostListContainer = ({ isGettingNewsfeed }: Props) => {
  const currentUserProfile: User = useReactiveVar(currentUserProfileVar);
  const currentGetUserPostsCursor: number = useReactiveVar(currentGetUserPostsCursorVar);

  const history = useHistory();

  const { data: postsData, loading: postsLoading, fetchMore } = useQuery(GetUserPostsDocument, {
    variables: {
      userId: currentUserProfile.id,
      cursor: currentGetUserPostsCursor,
      offsetLimit: OFFSET_LIMIT,
      isGettingNewsfeed
    },
    skip: !currentUserProfile.id,
    onError: (err: any) => console.log('getting user posts error:', err),
  });

  const [likePost] = useMutation(LikePostDocument, {
    update(cache, { data }) {
      const posts: any = readGetUserPostsQuery(cache, currentUserProfile.id);
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
      currentGetUserPostsCursorVar(currentGetUserPostsCursor + OFFSET_LIMIT);
      await fetchMore({
        variables: {
          userId: currentUserProfile.id,
          cursor: currentGetUserPostsCursor,
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
        clearPosts();
      }
    },
    [clearPosts]
  ); /* This calls the homePageQuery once to get the currently logged in user */

  const handleItemCreatorClick = (user: User) => {
    clearPosts();
    currentUserProfileVar({...user});
    currentGetUserPostsCursorVar(0);
    history.push('/profile');
  }

  return (
    <PostList
      posts={postsData?.getUserPosts}
      likePost={handleLikePost}
      handleItemCreatorClick={handleItemCreatorClick}
    />
  );
}

export default PostListContainer;