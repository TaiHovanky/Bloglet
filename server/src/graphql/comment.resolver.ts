import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { Post } from '../entity/Post';
import { User } from '../entity/User';
import { Comment } from '../entity/Comment';
import { requestContext } from '../types/context.interface';
import { errorHandler } from '../utils/error-handler.util';
import { isAuthenticated } from '../utils/is-authenticated.util';
import { CommentLike } from '../entity/CommentLike';

@Resolver()
export class CommentResolver {

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuthenticated)
  async createComment(
    @Arg('userId') userId: number,
    @Arg('postId') postId: number,
    @Arg('comment') comment: string,
    @Arg('createdAt') createdAt: string,
    @Ctx() { res }: requestContext
  ) {
    try {
      const user = await User.findOne({
        where: { id: userId },
        relations: ['comments']
      });
      const post = await Post
        .createQueryBuilder('posts')
        .where('posts.id = :postId', { postId })
        .leftJoinAndMapMany('posts.comments', 'comment', 'comment', 'posts.id = comment.post_id')
        .leftJoinAndMapOne('comment.user', 'users', 'users', 'comment.user_id = users.id')
        .getOne();

      if (user && post) {
        const newComment = new Comment(
          user,
          post,
          comment,
          createdAt
        );
        const savedComment = await Comment.save(newComment);
        post.comments = [...post.comments, savedComment];
        return post;
      }
      return null;
    } catch(err) {
      errorHandler(`Comment creation failed: ${err}`, res);
      return null;
    }
  }

  @Mutation(() => Comment, { nullable: true })
  async likeComment(
    @Arg('userId') userId: number,
    @Arg('commentId') commentId: number
  ) {
    const comment = await Comment
      .createQueryBuilder('comment')
      .where('comment.id = :commentId', { commentId })
      .leftJoinAndMapMany('comment.likes', 'comment_like', 'comment_like', 'comment.id = comment_like.comment_id')
      .leftJoinAndMapOne('comment_like.user', 'users', 'users', 'comment_like.user_id = users.id')
      .getOne();
    console.log('comment found', comment);
    const user = await User.findOne({
      where: { id: userId },
      relations: ['commentLikes']
    });

    if (user && comment) {
      const newCommentLike = new CommentLike(user, comment);
      const savedCommentLike = await CommentLike.save(newCommentLike);
      comment.likes = [...comment.likes, savedCommentLike];
      return comment;
    }
    return null;
  }

}