import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { errorHandler } from '../utils/errorHandler';
import { Post } from '../entity/Post';
import { requestContext } from '../types/context';
import { isAuthenticated } from '../utils/isAuthenticated';
import { User } from '../entity/User';
import { UserLikesPosts } from '../entity/Likes';

@Resolver()
export class PostResolver {
  @Query(() => [Post], { nullable: true })
  @UseMiddleware(isAuthenticated)
  async getUserPosts(
    @Arg('userId') userId: number
  ) {
    return Post
      .createQueryBuilder('posts')
      .where('posts.creatorId = :creatorId', { creatorId: userId })
      .leftJoinAndMapMany('posts.likes', 'user_likes_posts', 'likes', 'posts.id = likes.post_id')
      .leftJoinAndMapOne('likes.user', 'users', 'users', 'likes.user_id = users.id')
      .getMany()
      .catch((err) => {
        console.log('err', err);
        return null;
      });
  }

  @Query(() => Post)
  getPost(
    @Arg('postId') postId: number,
    @Ctx() { res }: requestContext
  ) {
    return Post.find({ where: { id: postId }})
      .catch(() => {
        errorHandler('Failed to get post', res);
      });
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async createPost(
    @Arg('creatorId') creatorId: number, 
    @Arg('title') title: string,
    @Arg('body') body: string
  ) {
    await Post.insert({
      creatorId, 
      title,
      body
    }).catch((err) => {
      errorHandler('Post creation failed', err);
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
      errorHandler('Failed to like post', res);
      return null;
    }
  }
}