import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Post } from '../entity/Post';
import { User } from '../entity/User';
import { UserLikesPosts } from '../entity/Likes';
import { requestContext } from '../types/context.interface';
import { isAuthenticated } from '../utils/is-authenticated.util';
import { errorHandler } from '../utils/error-handler.util';

@Resolver()
export class PostResolver {
  @Query(() => [Post], { nullable: true })
  @UseMiddleware(isAuthenticated)
  getUserPosts(
    @Arg('userId') userId: number,
    @Ctx() { res }: requestContext
  ) {
    return Post
      .createQueryBuilder('posts')
      .where('posts.creatorId = :creatorId', { creatorId: userId })
      .leftJoinAndMapMany('posts.comments', 'comment', 'comment', 'posts.id = comment.post_id')
      .leftJoinAndMapOne('comment.user', 'users', 'users', 'comment.user_id = users.id')
      .leftJoinAndMapMany('posts.likes', 'user_likes_posts', 'likes', 'posts.id = likes.post_id')
      .leftJoinAndMapOne('likes.user', 'users', 'users2', 'likes.user_id = users2.id')
      .getMany()
      .catch((err) => {
        errorHandler(`Failed to get user posts: ${err}`, res);
        return null;
      });
  }

  @Query(() => Post)
  getPost(
    @Arg('postId') postId: number,
    @Ctx() { res }: requestContext
  ) {
    return Post.find({ where: { id: postId }})
      .catch((err) => errorHandler(`Failed to get post: ${err}`, res));
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuthenticated)
  async createPost(
    @Arg('creatorId') creatorId: number, 
    @Arg('title') title: string,
    @Arg('body') body: string,
    @Ctx() { res }: requestContext
  ) {
    const newPost = new Post(title, body, creatorId);
    return await Post.save(newPost)
      .catch((err) => {
        errorHandler(`Post creation failed: ${err}`, res);
        return null;
      });
  }

  @Mutation(() => [Post], { nullable: true })
  @UseMiddleware(isAuthenticated)
  async likePost(
    @Arg('postId') postId: number,
    @Arg('userId') userId: number,
    @Arg('isAlreadyLiked') isAlreadyLiked: boolean,
    @Ctx() { res }: requestContext
  ) {
    try {
      const postToUpdate: Post | undefined = await Post
        .createQueryBuilder('posts')
        .where('posts.id = :postId', { postId })
        .leftJoinAndMapMany('posts.likes', 'user_likes_posts', 'likes', 'posts.id = likes.post_id')
        .leftJoinAndMapOne('likes.user', 'users', 'users', 'likes.user_id = users.id')
        .getOne();

      if (isAlreadyLiked && postToUpdate) {
        const existingLikeIndex = postToUpdate.likes.findIndex((like: UserLikesPosts) => like.user.id === userId);
        postToUpdate.likes.splice(existingLikeIndex, 1);
        await UserLikesPosts.createQueryBuilder('user_likes_posts')
          .delete()
          .where('user_likes_posts.user_id = :userId', { userId })
          .andWhere('user_likes_posts.post_id = :postId', { postId })
          .execute();
        return [postToUpdate];
      } else {
        const userToUpdate: User | undefined = await User
          .findOne({
            where: { id: userId },
            relations: ['likedPosts']
          });

        if (postToUpdate && userToUpdate) {
          const likePost = new UserLikesPosts(userToUpdate, postToUpdate);
          const successfulLike = await UserLikesPosts.save(likePost);
          postToUpdate.likes = [...postToUpdate.likes, successfulLike]
          return [postToUpdate];
        }
      }
      return null;
    } catch(err) {
      errorHandler(`Failed to like post: ${err}`, res);
      return null;
    }
  }
}