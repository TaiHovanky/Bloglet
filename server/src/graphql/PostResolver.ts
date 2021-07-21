import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { errorHandler } from '../utils/errorHandler';
import { Post } from '../entity/Post';
import { requestContext } from '../types/context';
import { isAuthenticated } from '../utils/isAuthenticated';
import { User } from '../entity/User';

@Resolver()
export class PostResolver {
  @Query(() => [Post], { nullable: true })
  @UseMiddleware(isAuthenticated)
  async getUserPosts(
    @Arg('userId') userId: number
  ) {
    return Post.find({
        where: { creatorId: userId },
        relations: ['likes']
      })
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

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async likePost(
    @Arg('postId') postId: number,
    @Arg('userId') userId: number,
    @Ctx() { res }: requestContext
  ) {
    try {
      const postToUpdate: any = await Post
        .findOne({
          where: { id: postId },
          relations: ['likes']
        });
      const userToUpdate: any = await User
        .findOne({
          where: { id: userId },
          relations: ['likedPosts']
        });

      if (postToUpdate && userToUpdate) {
        postToUpdate.likes.push(userToUpdate);
        userToUpdate.likedPosts.push(postToUpdate);
        await Post.save(postToUpdate).catch((err) => console.log('post update err', err));
        return true;
      }
      return false;
    } catch(err) {
      console.log('err in like post', err);
      errorHandler('Failed to like post', res);
      return false;
    }
  }
}