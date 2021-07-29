import { Field, ObjectType } from 'type-graphql';
import { Entity, BaseEntity, JoinColumn, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Post } from './Post';
import { User } from './User';

@ObjectType()
@Entity({ name: 'user_likes_posts' })
export class UserLikesPosts extends BaseEntity {
  constructor(
    user: User,
    post: Post
  ) {
    super();
    this.user = user;
    this.post = post;
  }

  @Field()
  @PrimaryGeneratedColumn() id: number;

  @Field(() => Post, { nullable: true })
  @ManyToOne(() => Post, (post: Post) => post.likes)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user: User) => user.likedPosts)
  @JoinColumn({ name: 'user_id' })
  user: User
}