import bcrypt, { compare } from 'bcryptjs';
import { Like } from 'typeorm';
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver, UseMiddleware } from 'type-graphql';
import { User } from '../entity/User';
import { requestContext } from '../types/context.interface';
import { sendRefreshToken } from '../utils/send-refresh-token.util';
import { errorHandler } from '../utils/error-handler.util';
import { createAccessToken, createRefreshToken } from '../utils/create-tokens.util';
import { isAuthenticated } from '../utils/is-authenticated.util';

@ObjectType()
class LoginResponse {
  @Field()
  token: string;

  @Field(() => User)
  user: User;
}

@Resolver()
export class UserResolver {

  @Query(() => [User])
  users(
    @Ctx() { res }: requestContext
  ) {
    return User.find({ relations: ['likedPosts']})
      .catch((err) => errorHandler(`Failed to get users: ${err}`, res));
  }

  @Mutation(() => Boolean)
  async register(
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { res }: requestContext
  ) {
    /* Hash the password and then insert the user data and hashed password into db. */
    const hashedPassword = await bcrypt.hash(password, 12);

    await User.insert({
      firstName,
      lastName,
      email,
      password: hashedPassword
    })
    .catch((err) => {
      errorHandler(`User registration failed: ${err}`, res);
      return false;
    });
    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { res }: requestContext
  ) {
    /* Get the user from database using the email, then compare the password that was entered
    to the password from the db. Sign a JWT and return that. */
    const user = await User.findOne({ where: { email }});

    if (user) {
      const isPasswordValid: boolean = await compare(password, user.password);

      if (isPasswordValid) {
        const accessToken = createAccessToken(user);
        const refreshToken = createRefreshToken(user);

        sendRefreshToken(res, refreshToken);
        return { token: accessToken, user };
      }
    } else {
      return errorHandler('Invalid password', res);
    }
    return errorHandler('Login failed', res);
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: any) {
    sendRefreshToken(res, '');
    return true;
  }

  @Query(() => User, { nullable: true }) // Query type needs to have its return type defined - can't infer type
  @UseMiddleware(isAuthenticated)
  async homePage(
    @Ctx() { payload, res }: requestContext
  ) {
    if (payload) {
      return User.findOne({ where: { email: payload.email }})
        .catch((err) => {
          errorHandler(`Home page user query failed: ${err}`, res);
          return null;
        });
    }
    return null;
  }

  @Query(() => [User], { nullable: true })
  @UseMiddleware(isAuthenticated)
  async searchUsers(
    @Arg('name') name: string,
    @Ctx() { res }: requestContext
  ) {
    if (name) {
      return User.find({ where: { firstName: Like(`%${name}%`) }})
        .catch((err) => {
          errorHandler(`Search user query failed: ${err}`, res);
        });
    }
    return null;
  }
}