import { Field, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import { UserLikesPosts } from "./Likes";

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ nullable: true })
  firstName: string;

  @Field()
  @Column({ nullable: true })
  lastName: string;

  @Field() // Field() indicates a field that can be returned by users query
  @Column('text', { nullable: true })
  email: string;

  @Column('text', { nullable: true })
  password: string;

  @Column('int', { default: 0, nullable: true })
  tokenVersion: number;

  @Field(() => [UserLikesPosts], { nullable: true })
  @OneToMany(() => UserLikesPosts, (likes: UserLikesPosts) => likes.user)
  likedPosts: Array<UserLikesPosts>;

  @Field(() => [User], { nullable: true })
  following: Array<User>;

  @Field(() => [User], { nullable: true })
  followers: Array<User>;
}
