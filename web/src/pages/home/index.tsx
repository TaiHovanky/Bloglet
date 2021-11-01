import React, { useEffect } from 'react';
import { Container, makeStyles, Typography } from '@material-ui/core';
import { useMutation, useQuery } from '@apollo/client';
import {
  useHomePageLazyQuery,
  useGetUserPostsQuery,
  Post,
  useGetFollowingQuery,
  useGetFollowersQuery,
  CreatePostDocument,
  LikeCommentDocument,
  LikePostDocument,
} from '../../generated/graphql';
import { currentGetUserPostsCursorVar, currentUserProfileVar, currentOffsetLimitVar } from '../../cache';
import NewPostForm from '../../components/new-post-form';
import PostList from '../../components/post-list';
import SplashPage from '../../components/splash-page';
import PrimaryAppBar from '../../components/primary-app-bar';
import getCurrentUserProfile from '../../cache-queries/current-user-profile';
import FollowButton from '../../components/follow-button';
import UserFollows from '../../components/user-follows';
import getCurrentGetUserPostsCursor from '../../cache-queries/current-user-posts-cursor';
import { SCROLL_DIRECTION_DOWN, useScrollDirection } from '../../hooks/use-scroll.hook';
import getCurrentOffsetLimit from '../../cache-queries/current-offset-limit';
import { readGetUserPostsQuery, updatePosts } from '../../utils/update-comments';

const useStyles = makeStyles(() => ({
  homePageContainer: {
    minHeight: '100vh'
  },
  currentUserInfoContainer: {
    marginBottom: 30
  }
}));

const Home: React.FC<any> = () => {
  const classes = useStyles();

  const [homePageQueryExecutor, { data: userData, loading }] = useHomePageLazyQuery({
    fetchPolicy: 'network-only',
    onCompleted: (data: any) => {
      if (data && data.homePage) {
        const {__typename, ...newUser} = data.homePage;
        currentUserProfileVar(newUser); /* this updates the local Apollo state in the cache for the currentUserProfileVar
        reactive variable. Instead of using routing to open a user profile, I'll be using local state to determine
        which user posts to display. In primaryAppBar, when a user is searched for and selected, currentUserProfileVar
        is updated, causing the useGetUserPostsQuery to call with a new userId. */
      }
    }
  });
  /* use the lazy query to prevent the "Can't perform a React state update on an unmounted component." error */

  // eslint-disable-next-line
  const currentUserProfile = useQuery(getCurrentUserProfile);
  // eslint-disable-next-line
  const currentGetUserPostsCursor = useQuery(getCurrentGetUserPostsCursor);
  // eslint-disable-next-line
  const currentOffsetLimit = useQuery(getCurrentOffsetLimit);

  const { data: postsData, loading: postsLoading, fetchMore } = useGetUserPostsQuery({
    variables: {
      userId: currentUserProfileVar().id,
      cursor: currentGetUserPostsCursorVar(),
      offsetLimit: currentOffsetLimitVar()
    },
    skip: !currentUserProfileVar().id,
    onError: (err) => console.log(err),
  });

  const { data: followingData, loading: followingLoading } = useGetFollowingQuery({
    variables: { userId: currentUserProfileVar().id }
  });

  const { data: followerData, loading: followerLoading } = useGetFollowersQuery({
    variables: { userId: currentUserProfileVar().id }
  });

  const [createPost] = useMutation(CreatePostDocument, {
    update(cache, data) {
      const posts: any = readGetUserPostsQuery(cache, currentUserProfileVar().id);
      cache.modify({
        fields: {
          getUserPosts(existingPosts: Array<Post>) {
            return [data.data.createPost, ...posts.getUserPosts as Array<Post>];
          }
        }
      });
    } /* To avoid refetching, I can use the cache update function to add the Post instance
    that was returned by the mutation to the existing array of posts. While this takes more
    code, it's ultimately faster than refetching because there's not a network call. */
  });

  const [likePost] = useMutation(LikePostDocument, {
    update(cache, { data }) {
      const posts: any = readGetUserPostsQuery(cache, currentUserProfileVar().id);
      cache.modify({
        fields: {
          getUserPosts(existingPosts) {
            return updatePosts(posts.getUserPosts, 'likes', data.likePost, false);
          }
        }
      })
    }
  });

  const [likeComment] = useMutation(LikeCommentDocument, {
    update(cache, { data }) {
      const posts: any = readGetUserPostsQuery(cache, currentUserProfileVar().id);
      cache.modify({
        fields: {
          getUserPosts(existingPost) {
            return updatePosts(posts.getUserPosts, 'comments', data.likeComment, true);
          }
        }
      })
    }
  });

  useEffect(
    () => {
      homePageQueryExecutor();
    },
    [homePageQueryExecutor]
  ); /* This calls the homePageQuery once to get the currently logged in user */

  const handleSubmit = async (e: React.FormEvent, callback: ()=> void) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    currentGetUserPostsCursorVar(currentGetUserPostsCursorVar() + 1);
    await createPost({
      variables: {
        creatorId: userData && userData.homePage ? userData.homePage.id : 0,
        content: formData.get('content') as string,
        createdAt: new Date().toLocaleString()
      }
    });
    callback();
  }

  const handleLikePost = (userId: number, postId: number, isAlreadyLiked: boolean) => {
    likePost({
      variables: {
        userId,
        postId,
        isAlreadyLiked
      }
    });
  }

  const handleLikeComment = (userId: number, commentId: number, isAlreadyLiked: boolean) => {
    likeComment({
      variables: {
        userId,
        commentId,
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
      currentGetUserPostsCursorVar(currentGetUserPostsCursorVar() + currentOffsetLimitVar())
      await fetchMore({
        variables: {
          userId: currentUserProfileVar().id,
          cursor: currentGetUserPostsCursorVar(),
          offsetLimit: 5
        }
      });
    }
  });

  if (loading || postsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={classes.homePageContainer}>
      {userData && userData.homePage ?
        <>
          <PrimaryAppBar user={userData.homePage} />
          <Container maxWidth="sm">
            <div className={classes.currentUserInfoContainer}>
              <Typography variant="h4">
                {`${currentUserProfileVar().firstName} ${currentUserProfileVar().lastName}`}
              </Typography>
              <UserFollows
                followers={followerData}
                following={followingData}
                followerLoading={followerLoading}
                followingLoading={followingLoading}
              />
              <FollowButton
                followers={followerData}
                loggedInUser={userData.homePage.id}
                userToBeFollowed={currentUserProfileVar().id}
              />
            </div>
            {currentUserProfileVar().id === userData.homePage.id &&
              <NewPostForm
                handleSubmit={handleSubmit}
                postsLength={postsData?.getUserPosts?.length}
              />
            }
            {postsData && postsData.getUserPosts &&
              <PostList
                posts={postsData?.getUserPosts}
                likePost={handleLikePost}
                likeComment={handleLikeComment}
                userId={userData.homePage.id}
              />
            }
          </Container>
        </> :
        <SplashPage />
      }
    </div>
  );
}

export default Home;