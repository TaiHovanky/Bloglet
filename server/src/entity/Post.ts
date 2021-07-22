import { Field, ObjectType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';
import { UserLikesPosts } from './Likes';

@ObjectType()
@Entity('posts')
export class Post extends BaseEntity {
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
  likes: Array<UserLikesPosts>
}