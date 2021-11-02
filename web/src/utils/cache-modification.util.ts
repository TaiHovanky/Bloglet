import { Post, Comment, GetUserPostsDocument } from '../generated/graphql';

export const updateComments = (post: Post, data: any) => {
  const updatedComments = post && post.comments ? [...post.comments] : [];
  const likedCommentIndex = updatedComments.findIndex((comment: Comment) => comment.id === data.id);
  updatedComments.splice(likedCommentIndex, 1, data);
  return updatedComments;
}

export const updatePosts = (
  posts: Array<Post>,
  propertyToBeUpdated: string,
  data: any,
  isUpdatingCommentLikes: boolean,
) => {
  const updatedPosts = [...posts];
  let updatedPostIndex = 0;
  let updatedPost: any = {};
  updatedPosts.forEach((post, index) => {
    if (
      (propertyToBeUpdated === 'likes' && post.id === data.id) ||
      (propertyToBeUpdated === 'comments' && isUpdatingCommentLikes && post.id === data.post.id) ||
      (propertyToBeUpdated === 'comments' && !isUpdatingCommentLikes && post.id === data.id)
    ) {
      updatedPostIndex = index;
      updatedPost = {...post};
      if (propertyToBeUpdated === 'likes') {
        updatedPost[propertyToBeUpdated] = data.likes;
      } else if (propertyToBeUpdated === 'comments' && isUpdatingCommentLikes) {
        updatedPost[propertyToBeUpdated] = updateComments(post, data);
      } else if (propertyToBeUpdated === 'comments' && !isUpdatingCommentLikes) {
        updatedPost[propertyToBeUpdated] = data.comments;
      }
    }
  });
  updatedPosts.splice(updatedPostIndex, 1, updatedPost);
  return updatedPosts;
}

export const readGetUserPostsQuery = (cache: any, userId: number) => {
  return cache.readQuery({
    query: GetUserPostsDocument,
    variables: { userId }
  });
}