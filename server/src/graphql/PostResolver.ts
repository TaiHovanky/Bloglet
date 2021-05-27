import { errorHandler } from '../utils/errorHandler';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Post } from 'src/entity/Post';
import { RequestContext } from './types';

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  getUserPosts(
    @Arg('userId') userId: number,
    @Ctx() { res }: RequestContext
  ) {
    return Post.find({ where: { creatorId: userId }})
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
    @Arg('title') title: string,
    @Arg('body') body: string,
    @Ctx() { res }: RequestContext
  ) {
    await Post.insert({
      title,
      body
    })
      .catch(() => {
        errorHandler('Failed to create post', res);
        return false;
      });
    
    return true;
  }
}