import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { requestContext } from "src/types/context";
import { errorHandler } from "../utils/errorHandler";
import { Follows } from "../entity/Follows";

@Resolver()
export class FollowerResolver {

  @Query(() => [Follows], { nullable: true })
  getFollowers(
    @Arg('userId') userId: number,
    @Ctx() { res }: requestContext
  ) {
    return Follows
      .createQueryBuilder('user_follows_user')
      .where('user_follows_user.following_id = :following_id', { 'following_id': userId })
      .leftJoinAndMapOne('user_follows_user.follower', 'users', 'users', 'user_follows_user.follower_id = users.id')
      .getMany()
      .catch((err) => {
        errorHandler(`Failed to get followers: ${err}`, res);
        return null;
      });
  }

  @Query(() => [Follows], { nullable: true })
  getFollowing(
    @Arg('userId') userId: number,
    @Ctx() { res }: requestContext
  ) {
    return Follows
      .createQueryBuilder('user_follows_user')
      .where('user_follows_user.follower_id = :follower_id', { 'follower_id': userId })
      .leftJoinAndMapOne('user_follows_user.following', 'users', 'users', 'user_follows_user.following_id = users.id')
      .getMany()
      .catch((err) => {
        errorHandler(`Failed to get followers: ${err}`, res);
        return null;
      });
  }
}