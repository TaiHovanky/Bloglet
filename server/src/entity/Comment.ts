import { Field, ObjectType } from 'type-graphql';
import { Entity, BaseEntity, JoinColumn, PrimaryGeneratedColumn, OneToOne, Column } from 'typeorm';
import { Post } from './Post';
import { User } from './User';

@ObjectType()
@Entity({ name: 'comment' })
export class Comment extends BaseEntity {
  constructor(user: User, comment: string, createdAt: string) {
    super();
    this.user = user;
    this.comment = comment;
    this.createdAt = createdAt;
  }

  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @OneToOne(() => User, (user: User) => user.comments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field(() => Post)
  @OneToOne(() => Post, (post: Post) => post.comments)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Field()
  @Column()
  comment: string;

  @Field()
  @Column()
  createdAt: string;
}
