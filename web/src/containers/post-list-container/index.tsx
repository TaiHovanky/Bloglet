import React, { useEffect } from 'react';
import PostList from '../../components/post-list';
import { useMutation, useQuery } from '@apollo/client';
import { currentGetUserPostsCursorVar, currentUserProfileVar, isSwitchingFromProfileToHomeVar, loggedInUserProfileVar } from '../../cache';
import { GetUserPostsDocument, LikePostDocument, User } from '../../generated/graphql';
import { OFFSET_LIMIT, SCROLL_DIRECTION_DOWN, useScrollDirection } from '../../hooks/use-scroll.hook';
import { readGetUserPostsQuery, updatePosts } from '../../utils/cache-modification.util';
import clearUserPosts from '../../cache-queries/clear-user-posts';

interface Props {
  isGettingNewsfeed: boolean;
  getUserPosts: any;
  history: any;
}

const PostListContainer = ({ isGettingNewsfeed, getUserPosts, history }: Props) => {
  // console.log('rendering postlist container', currentUserProfileVar(), currentGetUserPostsCursorVar());
  const { data: postsData, loading: postsLoading, fetchMore } = useQuery(GetUserPostsDocument, {
    variables: {
      userId: currentUserProfileVar().id,
      cursor: currentGetUserPostsCursorVar(),
      offsetLimit: OFFSET_LIMIT,
      isGettingNewsfeed
    },
    // skip: !currentUserProfileVar().id || isSwitchingFromProfileToHomeVar() === true,
    onError: (err: any) => console.log('getting user posts error:', err),
    onCompleted: (stuff) => console.log('stuff', stuff)
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
      currentGetUserPostsCursorVar(currentGetUserPostsCursorVar() + OFFSET_LIMIT);
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
        console.log('clearing posts');
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
    // Handles switching between user profiles while still on Home
    // getUserPosts({
    //   variables: {
    //     userId: user.id,
    //     cursor: 0,
    //     offsetLimit: OFFSET_LIMIT,
    //     isGettingNewsfeed: false
    //   }
    // });
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