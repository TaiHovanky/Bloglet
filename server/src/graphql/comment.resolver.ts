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
    // @Ctx() { res }: requestContext
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
        .leftJoinAndMapMany('posts.likes', 'post_like', 'likes', 'posts.id = likes.post_id')
        .leftJoinAndMapOne('likes.user', 'users', 'users2', 'likes.user_id = users.id')
        .getOne();

      if (user && post) {
        const newComment = new Comment(
          user,
          post,
          comment,
          createdAt,
        );
        const savedComment = await Comment.save(newComment);
        savedComment.likes = [];
        post.comments = [...post.comments, savedComment];
        post.likes = post.likes && post.likes.length ? post.likes : [];
        return post;
        // return savedComment;
      }
      return null;
    } catch(err) {
      // errorHandler(`Comment creation failed: ${err}`, res);
      console.log('errrrrrr', err);
      return null;
    }
  }

  @Mutation(() => Comment, { nullable: true })
  @UseMiddleware(isAuthenticated)
  async likeComment(
    @Arg('userId') userId: number,
    @Arg('commentId') commentId: number,
    @Arg('isAlreadyLiked') isAlreadyLiked: boolean,
    @Ctx() { res }: requestContext
  ) {
    try {
      const commentToUpdate: Comment | undefined = await Comment
        .createQueryBuilder('comment')
        .where('comment.id = :commentId', { commentId })
        .leftJoinAndMapMany('comment.likes', 'comment_like', 'comment_like', 'comment.id = comment_like.comment_id')
        .leftJoinAndMapOne('comment_like.user', 'users', 'users', 'comment_like.user_id = users.id')
        .getOne();
  
      if (isAlreadyLiked && commentToUpdate) {
        const existingLikeIndex = commentToUpdate.likes.findIndex((like: CommentLike) => like.user.id === userId);
        commentToUpdate.likes.splice(existingLikeIndex, 1);
        await CommentLike.createQueryBuilder('comment_like')
          .delete()
          .where('comment_like.user_id = :userId', { userId })
          .andWhere('comment_like.comment_id = :commentId', { commentId })
          .execute();
        return commentToUpdate;
      } else {
        const userToUpdate = await User.findOne({
          where: { id: userId },
          relations: ['likedComments']
        });
    
        if (userToUpdate && commentToUpdate) {
          const newCommentLike = new CommentLike(userToUpdate, commentToUpdate);
          const savedCommentLike = await CommentLike.save(newCommentLike);
          commentToUpdate.likes = [...commentToUpdate.likes, savedCommentLike];
          return commentToUpdate;
        }
      }
      return null;
    } catch(err) {
      errorHandler(`Failed to like post: ${err}`, res);
      return null;
    }
  }

}