import { Field, ObjectType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, CreateDateColumn } from 'typeorm';
import { PostLike } from './PostLike';
import { Comment } from './Comment';

@ObjectType()
@Entity('posts')
export class Post extends BaseEntity {
  constructor(
    content: string,
    creatorId: number,
  ) {
    super();
    this.content = content;
    this.creatorId = creatorId;
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
}