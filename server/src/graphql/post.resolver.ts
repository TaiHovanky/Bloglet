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
  async getUserPosts(
    @Arg('userId') userId: number,
    @Ctx() { res }: requestContext
  ) {
    return Post
      .createQueryBuilder('posts')
      .where('posts.creatorId = :creatorId', { creatorId: userId })
      .leftJoinAndMapMany('posts.likes', 'user_likes_posts', 'likes', 'posts.id = likes.post_id')
      .leftJoinAndMapOne('likes.user', 'users', 'users', 'likes.user_id = users.id')
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

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async createPost(
    @Arg('creatorId') creatorId: number, 
    @Arg('title') title: string,
    @Arg('body') body: string,
    @Ctx() { res }: requestContext
  ) {
    await Post.insert({
      creatorId, 
      title,
      body
    }).catch((err) => {
      errorHandler(`Post creation failed: ${err}`, res);
      return false;
    });
    return true;
  }

  @Mutation(() => [Post], { nullable: true })
  @UseMiddleware(isAuthenticated)
  async likePost(
    @Arg('postId') postId: number,
    @Arg('userId') userId: number,
    @Ctx() { res }: requestContext
  ) {
    try {
      const postToUpdate: Post | undefined = await Post
        .findOne({
          where: { id: postId },
          relations: ['likes']
        });
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
      return null;
    } catch(err) {
      errorHandler(`Failed to like post: ${err}`, res);
      return null;
    }
  }
}