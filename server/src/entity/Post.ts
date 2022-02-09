import { Field, ObjectType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PostLike } from './PostLike';
import { Comment } from './Comment';
import { User } from './User';

@ObjectType()
@Entity('posts')
export class Post extends BaseEntity {
  constructor(
    content: string,
    user: User
  ) {
    super();
    this.content = content;
    this.user = user;
  }

  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  content: string;

  @Field()
  @Column({ nullable: true })
  creatorId: number;

  @Field({ nullable: true })
  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @Field(() => [PostLike], { nullable: true })
  @OneToMany(() => PostLike, (likes: PostLike) => likes.post)
  likes: Array<PostLike>;

  @Field(() => [Comment], { nullable: true })
  @OneToMany(() => Comment, (comment: Comment) => comment.post)
  comments: Array<Comment>;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, user => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: User;
}