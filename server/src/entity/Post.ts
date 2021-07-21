import { Field, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable } from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity('posts')
export class Post extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  body: string;

  @Field()
  @Column()
  creatorId: number;

  @Field(() => [User])
  @ManyToMany(() => User, (user: User) => user.likedPosts, { cascade: ['insert', 'update'] })
  @JoinTable({ name: 'likes' })
  likes: User[]
}