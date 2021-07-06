import { Field, ObjectType } from "type-graphql";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable} from "typeorm";
import { Post } from "./Post";

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field() // Field() indicates a field that can be returned by users query
  @Column('text')
  email: string;

  @Column('text')
  password: string;

  @Column('int', {default: 0})
  tokenVersion: number;

  @ManyToMany(() => Post, (post: Post) => post.favorites)
  @JoinTable()
  favoritedPosts: Post[]
}
