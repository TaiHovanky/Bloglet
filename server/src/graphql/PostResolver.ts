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
      relations: ['favorites']
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
  async favoritePost(
    @Arg('postId') postId: number,
    @Arg('userId') userId: number,
    @Ctx() { res }: requestContext
  ) {
    try {
      const postToUpdate = await Post.findOne(postId, { relations: ['favorites']});
      const userToUpdate = await User.findOne(userId, { relations: ['favoritedPosts']});

      if (postToUpdate && userToUpdate) {
        postToUpdate.favorites = [...postToUpdate.favorites, userToUpdate];
        userToUpdate.favoritedPosts = [...userToUpdate.favoritedPosts, postToUpdate];
        await Post.save(postToUpdate);
        await User.save(userToUpdate);
        return true;
      }
      return false;
    } catch(err) {
      errorHandler('Failed to get post', res);
      return false;
    }
  }
}