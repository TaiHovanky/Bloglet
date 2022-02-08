import { Field, ObjectType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';
import { Follows } from './Follows';
import { PostLike } from './PostLike';
import { Comment } from './Comment';
import { CommentLike } from './CommentLike';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ nullable: true })
  firstName: string;

  @Field()
  @Column({ nullable: true })
  lastName: string;

  @Field() // Field() indicates a field that can be returned by users query
  @Column('text', { unique: true })
  email: string;

  @Column('text', { nullable: true })
  password: string;

  @Column('int', { default: 0, nullable: true })
  tokenVersion: number;

  @Field(() => [PostLike], { nullable: true })
  @OneToMany(() => PostLike, (likes: PostLike) => likes.user)
  likedPosts: Array<PostLike>;

  @Field(() => [Follows], { nullable: true })
  @OneToMany(() => Follows, (follows: Follows) => follows.following)
  /* The inverse relationship corresponds to the way the field is defined 
  in Follows */
  following: Array<Follows>;

  @Field(() => [Follows], { nullable: true })
  @OneToMany(() => Follows, (follows: Follows) => follows.follower)
  followers: Array<Follows>;

  @Field(() => [Comment], { nullable: true })
  @OneToMany(() => Comment, (comment: Comment) => comment.user)
  comments: Array<Comment>;

  @Field(() => [CommentLike], { nullable: true })
  @OneToMany(() => CommentLike, (commentLike: CommentLike) => commentLike.user)
  likedComments: Array<CommentLike>;
}
