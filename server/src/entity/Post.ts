import { Field, ObjectType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';
import { PostLike } from './PostLike';
import { Comment } from './Comment';

@ObjectType()
@Entity('posts')
export class Post extends BaseEntity {
  constructor(
    content: string,
    creatorId: number,
    createdAt: string
  ) {
    super();
    this.content = content;
    this.creatorId = creatorId;
    this.createdAt = createdAt;
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
  @Column({ nullable: true })
  createdAt: string;

  // @Field()
  // cursor: number;

  @Field(() => [PostLike], { nullable: true })
  @OneToMany(() => PostLike, (likes: PostLike) => likes.post)
  likes: Array<PostLike>;

  @Field(() => [Comment], { nullable: true })
  @OneToMany(() => Comment, (comment: Comment) => comment.post)
  comments: Array<Comment>;
}