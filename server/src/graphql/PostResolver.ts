import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { errorHandler } from '../utils/errorHandler';
import { Post } from '../entity/Post';
import { requestContext } from '../types/context';
import { isAuthenticated } from '../utils/isAuthenticated';

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async getUserPosts(
    @Arg('userId') userId: number,
    @Ctx() { res }: requestContext
  ) {
    console.log('userid in posts', userId);
    return await Post.find({ where: { creatorId: userId }})
      .catch(() => {
        errorHandler('Failed to get user\'s posts', res);
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
}