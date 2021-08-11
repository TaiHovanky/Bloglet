import { Field, ObjectType } from 'type-graphql';
import { Entity, BaseEntity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@ObjectType()
@Entity({ name: 'user_follows_user' })
export class Follows extends BaseEntity {
  constructor(
    following: User,
    follower: User
  ) {
    super();
    this.following = following;
    this.follower = follower;
  }

  @Field()
  @PrimaryGeneratedColumn() id: number;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user: User) => user.followers)
  @JoinColumn({ name: 'follower_id' })
  follower: User;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user: User) => user.following)
  @JoinColumn({ name: 'following_id' })
  following: User;
}