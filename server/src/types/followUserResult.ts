import { Field, ObjectType } from 'type-graphql';
import { User } from '../entity/User';

@ObjectType()
export class FollowUserResult {
  constructor(
    user: User,
    followedUser: User
  ) {
    this.user = user;
    this.followedUser = followedUser;
  }

  @Field()
  public user: User;

  @Field()
  public followedUser: User;
}