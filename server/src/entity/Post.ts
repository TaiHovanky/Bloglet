import { Field, ObjectType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';
import { PostLike } from './PostLike';
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

  @Field(() => [PostLike], { nullable: true })
  @OneToMany(() => PostLike, (likes: PostLike) => likes.post)
  likes: Array<PostLike>;

  @Field(() => [Comment], { nullable: true })
  @OneToMany(() => Comment, (comment: Comment) => comment.post)
  comments: Array<Comment>;
}