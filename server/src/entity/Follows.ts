import { Field, ObjectType } from 'type-graphql';
import { Entity, BaseEntity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@ObjectType()
@Entity({ name: 'user_follows_user' })
export class Follows extends BaseEntity {
  constructor(
    user: number,
    follower: number
  ) {
    super();
    this.user = user;
    this.follower = follower;
  }

  @Field()
  @PrimaryGeneratedColumn() id: number;

  @Field(() => Number, { nullable: true })
  @ManyToOne(() => User, (user: User) => user.followers)
  @JoinColumn({ name: 'follower_id' })
  follower: Number;

  @Field(() => Number, { nullable: true })
  @ManyToOne(() => User, (user: User) => user.following)
  @JoinColumn({ name: 'user_id' })
  user: Number;
}