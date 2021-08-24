import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { Post } from '../entity/Post';
import { User } from '../entity/User';
import { Comment } from '../entity/Comment';
import { requestContext } from '../types/context.interface';
import { errorHandler } from '../utils/error-handler.util';

@Resolver()
export class CommentResolver {

  @Mutation(() => Comment)
  createComment(
    @Arg('user') user: User,
    @Arg('post') post: Post,
    @Arg('comment') comment: string,
    @Arg('createdAt') createdAt: string,
    @Ctx() { res }: requestContext
  ) {
    return Comment.insert({
      user,
      post,
      comment,
      createdAt
    })
      .catch((err) => errorHandler(`Comment creation failed: ${err}`, res));
  }
}