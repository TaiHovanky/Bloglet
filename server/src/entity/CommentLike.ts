import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Comment } from './Comment';

@ObjectType()
@Entity({ name: 'comment_like' })
export class CommentLike extends BaseEntity {
  constructor(user: User, comment: Comment) {
    super();
    this.user = user;
    this.comment = comment;
  }

  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user: User) => user.likedComments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field(() => Comment, { nullable: true })
  @ManyToOne(() => Comment, (comment: Comment) => comment.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'comment_id' })
  comment: Comment;
}
