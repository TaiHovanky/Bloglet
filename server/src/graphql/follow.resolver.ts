import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Follows } from '../entity/Follows';
import { User } from '../entity/User';
import { errorHandler } from '../utils/error-handler.util';
import { isAuthenticated } from '../utils/is-authenticated.util';

@Resolver()
export class FollowerResolver {

  @Query(() => [Follows], { nullable: true })
  @UseMiddleware(isAuthenticated)
  getFollowers(
    @Arg('userId') userId: number
  ) {
    return Follows
      .createQueryBuilder('user_follows_user')
      .where('user_follows_user.following_id = :following_id', { 'following_id': userId })
      .leftJoinAndMapOne('user_follows_user.follower', 'users', 'users', 'user_follows_user.follower_id = users.id')
      .getMany()
      .catch((err) => {
        errorHandler(`Failed to get followers: ${err}`);
        return null;
      });
  }

  @Query(() => [Follows], { nullable: true })
  @UseMiddleware(isAuthenticated)
  getFollowing(
    @Arg('userId') userId: number
  ) {
    return Follows
      .createQueryBuilder('user_follows_user')
      .where('user_follows_user.follower_id = :follower_id', { 'follower_id': userId })
      .leftJoinAndMapOne('user_follows_user.following', 'users', 'users', 'user_follows_user.following_id = users.id')
      .getMany()
      .catch((err) => {
        errorHandler(`Failed to get followers: ${err}`);
        return null;
      });
  }

  @Mutation(() => Follows, { nullable: true })
  @UseMiddleware(isAuthenticated)
  async followUser(
    @Arg('loggedInUser') loggedInUser: number,
    @Arg('userToBeFollowed') userToBeFollowed: number,
    @Arg('isAlreadyFollowing') isAlreadyFollowing: boolean
  ) {
    try {
      if (isAlreadyFollowing) {
        await Follows.createQueryBuilder('user_follows_user')
          .delete()
          .where('user_follows_user.follower_id = :follower_id', { 'follower_id': loggedInUser })
          .andWhere('user_follows_user.following_id = :following_id', { 'following_id': userToBeFollowed })
          .execute();
        return null;
      } else {
        const updatedLoggedInUser = await User.findOne({
          where: { id: loggedInUser },
          relations: ['following']
        });
        const updatedUserToBeFollowed = await User.findOne({
          where: { id: userToBeFollowed },
          relations: ['followers']
        });
        if (updatedLoggedInUser && updatedUserToBeFollowed) {
          const followUser = new Follows(updatedUserToBeFollowed, updatedLoggedInUser)
          return await Follows.save(followUser);
        }
      }
      return null;
    } catch (err) {
      errorHandler(`Failed to like post: ${err}`);
      return null;
    }
  }
}