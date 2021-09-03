import { Field, ObjectType } from 'type-graphql';
import { Entity, BaseEntity, JoinColumn, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { CommentLike } from './CommentLike';
import { Post } from './Post';
import { User } from './User';

@ObjectType()
@Entity({ name: 'comment' })
export class Comment extends BaseEntity {
  constructor(user: User, post: Post, comment: string, createdAt: string) {
    super();
    this.user = user;
    this.post = post;
    this.comment = comment;
    this.createdAt = createdAt;
  }

  @Field()
  @PrimaryGeneratedColumn()
  id: string;

  
  @Field()
  @Column()
  comment: string;
  
  @Field()
  @Column()
  createdAt: string;

  @Field()
  @Column({ type: 'int', default: 0 })
  likeCount: number;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user: User) => user.comments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field(() => Post, { nullable: true })
  @ManyToOne(() => Post, (post: Post) => post.comments)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Field(() => [CommentLike], { nullable: true })
  @OneToMany(() => CommentLike, (commentLike: CommentLike) => commentLike.comment)
  likes: Array<CommentLike>;
}
