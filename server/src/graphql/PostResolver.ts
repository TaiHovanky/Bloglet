import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { errorHandler } from '../utils/errorHandler';
import { Post } from '../entity/Post';
import { RequestContext } from './types';

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async getUserPosts(
    @Arg('userId') userId: number,
    @Ctx() { res }: RequestContext
  ) {
    return await Post.find({ where: { creatorId: userId }})
      .catch(() => {
        errorHandler('Failed to get user\'s posts', res);
      });
  }

  @Query(() => Post)
  getPost(
    @Arg('postId') postId: number,
    @Ctx() { res }: RequestContext
  ) {
    return Post.find({ where: { id: postId }})
      .catch(() => {
        errorHandler('Failed to get post', res);
      });
  }

  @Mutation(() => Boolean)
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
      errorHandler('User registration failed', err);
      return false;
    });
    return true;
  }
}