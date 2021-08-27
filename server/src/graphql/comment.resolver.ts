import { Arg, Mutation, Resolver } from 'type-graphql';
import { Post } from '../entity/Post';
import { User } from '../entity/User';
import { Comment } from '../entity/Comment';
// import { requestContext } from '../types/context.interface';
// import { errorHandler } from '../utils/error-handler.util';

@Resolver()
export class CommentResolver {

  @Mutation(() => Comment, { nullable: true })
  async createComment(
    @Arg('userId') userId: number,
    @Arg('postId') postId: number,
    @Arg('comment') comment: string,
    @Arg('createdAt') createdAt: string,
    // @Ctx() { res }: requestContext
  ) {
    try {
      const user = await User.findOne({
        where: { id: userId },
        relations: ['comments']
      });
      const post = await Post.findOne({
        where: { id: postId },
        relations: ['comments']
      });
      console.log('user and post', !!user, !!post);
      if (user && post) {
        const newComment = new Comment(
          user,
          post,
          comment,
          createdAt
        );
        console.log('new comment', newComment);
        return await Comment.save(newComment);
          // .catch((err) => errorHandler(`Comment creation failed: ${err}`, res));
      }
      return null;
    } catch(err) {
      console.log('err', err);
      // errorHandler(`Comment creation failed: ${err}`, res);
      return null;
    }
  }
}