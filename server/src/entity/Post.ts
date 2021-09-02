import { Field, ObjectType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';
import { UserLikesPosts } from './Likes';
import { Comment } from './Comment';

@ObjectType()
@Entity('posts')
export class Post extends BaseEntity {
  constructor(
    title: string,
    body: string,
    creatorId: number
  ) {
    super();
    this.title = title;
    this.body = body;
    this.creatorId = creatorId;
  }

  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ nullable: true })
  title: string;

  @Field()
  @Column({ nullable: true })
  body: string;

  @Field()
  @Column({ nullable: true })
  creatorId: number;

  @Field(() => [UserLikesPosts], { nullable: true })
  @OneToMany(() => UserLikesPosts, (likes: UserLikesPosts) => likes.post)
  likes: Array<UserLikesPosts>;

  @Field(() => [Comment], { nullable: true })
  @OneToMany(() => Comment, (comment: Comment) => comment.post)
  comments: Array<Comment>;
}