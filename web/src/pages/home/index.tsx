import React, { useEffect } from 'react';
import { Container, makeStyles, Typography } from '@material-ui/core';
import { useQuery } from '@apollo/client';
import {
  useHomePageLazyQuery,
  // useGetUserPostsQuery,
  // Post,
  // useGetFollowingQuery,
  // useGetFollowersQuery,
  // CreatePostDocument,
  // LikeCommentDocument,
  // LikePostDocument,
} from '../../generated/graphql';
// import NewPostForm from '../../components/post-input';
// import PostList from '../../components/post-list';
import SplashPage from '../../components/splash-page';
import getCurrentUserProfile from '../../cache-queries/current-user-profile';
// import FollowButton from '../../components/follow-button';
// import UserFollows from '../../components/user-follows';
import getCurrentGetUserPostsCursor from '../../cache-queries/current-user-posts-cursor';
import { currentUserProfileVar } from '../../cache';
import UserFollowsContainer from '../../containers/user-follows-container';
import PostInputContainer from '../../containers/post-input-container';
import PostListContainer from '../../containers/post-list-container';
import PrimaryAppBarContainer from '../../containers/primary-app-bar-container';
// import { OFFSET_LIMIT, SCROLL_DIRECTION_DOWN, useScrollDirection } from '../../hooks/use-scroll.hook';
// import { readGetUserPostsQuery, updatePosts } from '../../utils/cache-modification.util';

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

  // const { data: postsData, loading: postsLoading, fetchMore } = useGetUserPostsQuery({
  //   variables: {
  //     userId: currentUserProfileVar().id,
  //     cursor: currentGetUserPostsCursorVar(),
  //     offsetLimit: OFFSET_LIMIT
  //   },
  //   skip: !currentUserProfileVar().id,
  //   onError: (err) => console.log(err),
  //   onCompleted: (data) => {
  //     console.log('dataaaaaaa', data);
  //   }
  // });

  // const { data: followingData, loading: followingLoading } = useGetFollowingQuery({
  //   variables: { userId: currentUserProfileVar().id }
  // });

  // const { data: followerData, loading: followerLoading } = useGetFollowersQuery({
  //   variables: { userId: currentUserProfileVar().id }
  // });

  // const [createPost] = useMutation(CreatePostDocument, {
  //   update(cache, data) {
  //     const posts: any = readGetUserPostsQuery(cache, currentUserProfileVar().id);
  //     cache.modify({
  //       fields: {
  //         getUserPosts() {
  //           return [data.data.createPost, ...posts.getUserPosts as Array<Post>];
  //         }
  //       }
  //     });
  //   } /* To avoid refetching, I can use the cache update function to add the Post instance
  //   that was returned by the mutation to the existing array of posts. While this takes more
  //   code, it's ultimately faster than refetching because there's not a network call. */
  // });

  // const [likePost] = useMutation(LikePostDocument, {
  //   update(cache, { data }) {
  //     const posts: any = readGetUserPostsQuery(cache, currentUserProfileVar().id);
  //     cache.modify({
  //       fields: {
  //         getUserPosts() {
  //           return updatePosts(posts.getUserPosts, 'likes', data.likePost, false);
  //         }
  //       }
  //     })
  //   }
  // });

  // const [likeComment] = useMutation(LikeCommentDocument, {
  //   update(cache, { data }) {
  //     const posts: any = readGetUserPostsQuery(cache, currentUserProfileVar().id);
  //     cache.modify({
  //       fields: {
  //         getUserPosts() {
  //           return updatePosts(posts.getUserPosts, 'comments', data.likeComment, true);
  //         }
  //       }
  //     })
  //   }
  // });

  useEffect(
    () => {
      homePageQueryExecutor();
    },
    [homePageQueryExecutor]
  ); /* This calls the homePageQuery once to get the currently logged in user */

  // const handleSubmit = async (e: React.FormEvent, callback: ()=> void) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.target as HTMLFormElement);
  //   currentGetUserPostsCursorVar(currentGetUserPostsCursorVar() + 1);
  //   await createPost({
  //     variables: {
  //       creatorId: userData && userData.homePage ? userData.homePage.id : 0,
  //       content: formData.get('content') as string,
  //     }
  //   });
  //   callback(); // Used to clear the post form after saving a post
  // }

  // const handleLikePost = (userId: number, postId: number, isAlreadyLiked: boolean) => {
  //   likePost({
  //     variables: {
  //       userId,
  //       postId,
  //       isAlreadyLiked
  //     }
  //   });
  // }

  // const handleLikeComment = (userId: number, commentId: number, isAlreadyLiked: boolean) => {
  //   likeComment({
  //     variables: {
  //       userId,
  //       commentId,
  //       isAlreadyLiked
  //     }
  //   });
  // }
  
  // useScrollDirection(async (scrollDirection: string) => {
  //   if (
  //     scrollDirection === SCROLL_DIRECTION_DOWN &&
  //     window.scrollY + window.innerHeight > document.documentElement.scrollHeight - 2 &&
  //     !postsLoading &&
  //     postsData &&
  //     postsData.getUserPosts &&
  //     postsData.getUserPosts.length
  //   ) {
  //     currentGetUserPostsCursorVar(currentGetUserPostsCursorVar() + OFFSET_LIMIT)
  //     await fetchMore({
  //       variables: {
  //         userId: currentUserProfileVar().id,
  //         cursor: currentGetUserPostsCursorVar(),
  //         offsetLimit: OFFSET_LIMIT
  //       }
  //     });
  //   }
  // });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={classes.homePageContainer}>
      {userData && userData.homePage ?
        <>
          <PrimaryAppBarContainer user={userData.homePage} />
          <Container maxWidth="sm">
            <div className={classes.currentUserInfoContainer}>
              <Typography variant="h4">
                {`${currentUserProfileVar().firstName} ${currentUserProfileVar().lastName}`}
              </Typography>
              {/* <UserFollows
                followers={followerData}
                following={followingData}
                followerLoading={followerLoading}
                followingLoading={followingLoading}
              /> */}
              <UserFollowsContainer
                loggedInUser={userData.homePage.id}
                userToBeFollowed={currentUserProfileVar().id}
              />
              {/* <FollowButton
                followers={followerData}
                loggedInUser={userData.homePage.id}
                userToBeFollowed={currentUserProfileVar().id}
              /> */}
              {/* <FollowButtonContainer /> */}
            </div>
            {currentUserProfileVar().id === userData.homePage.id &&
              // <NewPostForm handleSubmit={handleSubmit} />
              <PostInputContainer userId={userData.homePage.id} />
            }
            {/* {postsData && postsData.getUserPosts &&
              <PostList
                posts={postsData?.getUserPosts}
                likePost={handleLikePost}
                likeComment={handleLikeComment}
                userId={userData.homePage.id}
              />
            } */}
            <PostListContainer />
          </Container>
        </> :
        <SplashPage />
      }
    </div>
  );
}

export default Home;