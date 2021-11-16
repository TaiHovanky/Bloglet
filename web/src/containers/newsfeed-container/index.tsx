import React from 'react';
import PostList from '../../components/post-list';
import { useMutation, useQuery } from '@apollo/client';
import { currentGetUserPostsCursorVar, currentUserProfileVar } from '../../cache';
import { GetUserNewsfeedDocument, LikePostDocument } from '../../generated/graphql';
import { OFFSET_LIMIT, SCROLL_DIRECTION_DOWN, useScrollDirection } from '../../hooks/use-scroll.hook';
import { readGetUserNewsfeedQuery, updatePosts } from '../../utils/cache-modification.util';

interface Props {
  loggedInUser: number;
}

const NewsfeedContainer = ({ loggedInUser }: Props) => {
  const { data: newsfeedData, loading: newsfeedLoading, fetchMore } = useQuery(GetUserNewsfeedDocument, {
    variables: {
      userId: loggedInUser,
      cursor: currentGetUserPostsCursorVar(),
      offsetLimit: OFFSET_LIMIT
    },
    skip: !currentUserProfileVar().id,
    onError: (err: any) => console.log('getting user posts error:', err),
  });

  const [likePost] = useMutation(LikePostDocument, {
    update(cache, { data }) {
      const posts: any = readGetUserNewsfeedQuery(cache, loggedInUser);
      cache.modify({
        fields: {
          getUserPosts() {
            return updatePosts(posts.getUserNewsfeed, 'likes', data.likePost, false);
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
      !newsfeedLoading &&
      newsfeedData &&
      newsfeedData.getUserNewsfeed &&
      newsfeedData.getUserNewsfeed.length
    ) {
      currentGetUserPostsCursorVar(currentGetUserPostsCursorVar() + OFFSET_LIMIT)
      await fetchMore({
        variables: {
          userId: loggedInUser,
          cursor: currentGetUserPostsCursorVar(),
          offsetLimit: OFFSET_LIMIT
        }
      });
    }
  });

  if (newsfeedLoading) {
    return <div>Loading...</div>;
  }

  return (
    <PostList
      posts={newsfeedData?.getUserNewsfeed}
      likePost={handleLikePost}
    />
  );
}

export default NewsfeedContainer;