import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Post } from '../entity/Post';
import { User } from '../entity/User';
import { PostLike } from '../entity/PostLike';
import { isAuthenticated } from '../utils/is-authenticated.util';
import { errorHandler } from '../utils/error-handler.util';

@Resolver()
export class PostResolver {
  @Query(() => [Post], { nullable: true })
  // @UseMiddleware(isAuthenticated)
  getUserPosts(
    @Arg('userId') userId: number,
    @Arg('cursor') cursor: number,
    @Arg('offsetLimit') offsetLimit: number,
    @Arg('isGettingNewsfeed') isGettingNewsfeed: boolean,
  ) {
    let query = Post
      .createQueryBuilder('posts')
      .orderBy('posts.createdAt', 'DESC')
      .skip(cursor)
      .take(offsetLimit);

    if (isGettingNewsfeed) {
      query = query
        .leftJoinAndSelect('users', 'users', 'posts.user_id = users.id')
        .leftJoin('users.following', 'user_follows_user')
        .where('user_follows_user.follower_id = :userId OR posts.user_id = :userId', { userId });
    } else {
      query = query
        .where('posts.user_id = :userId', { userId });
    }
    query = query
      .leftJoinAndMapMany('posts.comments', 'comment', 'comment', 'posts.id = comment.post_id')
      .leftJoinAndMapOne('comment.user', 'users', 'users2', 'comment.user_id = users2.id')
      .leftJoinAndMapMany('comment.likes', 'comment_like', 'comment_like', 'comment.id = comment_like.comment_id')
      .leftJoinAndMapOne('comment_like.user', 'users', 'users3', 'comment_like.user_id = users3.id')
      .leftJoinAndMapMany('posts.likes', 'post_like', 'likes', 'posts.id = likes.post_id')
      .leftJoinAndMapOne('likes.user', 'users', 'users4', 'likes.user_id = users4.id')
      .leftJoinAndMapOne('posts.user', 'users', 'users5', 'posts.user_id = users5.id')

    return query
      .getMany()
      .catch((err) => {
        errorHandler(`Failed to get user posts: ${err}`);
        return null;
      });
  }

  @Query(() => Post)
  getPost(
    @Arg('postId') postId: number,
  ) {
    return Post.find({ where: { id: postId }})
      .catch((err) => errorHandler(`Failed to get post: ${err}`));
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuthenticated)
  async createPost(
    @Arg('creatorId') creatorId: number, 
    @Arg('content') content: string,
  ) {
    const user = await User.findOne({
      where: { id: creatorId },
      relations: ['posts']
    });
    if (user) {
      const newPost = new Post(content, user);
      const savedPost = await Post.save(newPost);
      savedPost.comments = [];
      savedPost.likes = [];
      return savedPost;
    }
    return null;
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuthenticated)
  async likePost(
    @Arg('postId') postId: number,
    @Arg('userId') userId: number,
    @Arg('isAlreadyLiked') isAlreadyLiked: boolean,
  ) {
    try {
      const postToUpdate: Post | undefined = await Post
        .createQueryBuilder('posts')
        .where('posts.id = :postId', { postId })
        .leftJoinAndMapMany('posts.likes', 'post_like', 'likes', 'posts.id = likes.post_id')
        .leftJoinAndMapOne('likes.user', 'users', 'users', 'likes.user_id = users.id')
        .getOne();

      if (isAlreadyLiked && postToUpdate) {
        const existingLikeIndex = postToUpdate.likes.findIndex((like: PostLike) => like.user.id === userId);
        postToUpdate.likes.splice(existingLikeIndex, 1);
        await PostLike.createQueryBuilder('post_like')
          .delete()
          .where('post_like.user_id = :userId', { userId })
          .andWhere('post_like.post_id = :postId', { postId })
          .execute();
        return postToUpdate;
      } else {
        const userToUpdate: User | undefined = await User
          .findOne({
            where: { id: userId },
            relations: ['likedPosts']
          });

        if (postToUpdate && userToUpdate) {
          const likePost = new PostLike(userToUpdate, postToUpdate);
          const successfulLike = await PostLike.save(likePost);
          postToUpdate.likes = [...postToUpdate.likes, successfulLike]
          return postToUpdate;
        }
      }
      return null;
    } catch(err) {
      errorHandler(`Failed to like post: ${err}`);
      return null;
    }
  }

  @Mutation(() => Boolean, { nullable: true })
  async deletePost(
    @Arg('postId') postId: number
  ) {
    try {
      await Post
        .createQueryBuilder('posts')
        .delete()
        .where('posts.id = :postId', { postId })
        .execute();
      return true;
    } catch(err) {
      errorHandler(`Failed to delete post: ${err}`);
      return false;
    }
  }
}