import bcrypt, { compare } from 'bcryptjs';
import { Like } from 'typeorm';
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver, UseMiddleware } from 'type-graphql';
import { User } from '../entity/User';
import { requestContext } from '../types/context.interface';
import { sendRefreshToken } from '../utils/send-refresh-token.util';
import { errorHandler } from '../utils/error-handler.util';
import { isAuthenticated } from '../utils/is-authenticated.util';
import FieldError from '../types/error.object-type';

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
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

  @Mutation(() => UserResponse)
  async register(
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { req, res }: requestContext
  ) {
    if (password.length <= 2) {
      return {
        errors: [
          {
            field: "password",
            message: "password must be greater than 2",
          },
        ],
      };
    }
    /* Hash the password and then insert the user data and hashed password into db. */
    const hashedPassword = await bcrypt.hash(password, 12);
    try {
      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword
      })
        .save()

      req.session.user = user;
      return { user };
    } catch(err) {
      errorHandler(`User registration failed: ${err}`, res);
      return { errors: [{ field: 'registration', message: 'registration failed' }] };
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { req }: requestContext
  ) {
    /* Get the user from database using the email, then compare the password that was entered
    to the password from the db. Sign a JWT and return that. */
    const user = await User.findOne({ where: { email }});

    if (user) {
      const isPasswordValid: boolean = await compare(password, user.password);
      if (isPasswordValid) {
        req.session.user = user;
        return { user };
      }
    }
    return { errors: [{ field: 'login', message: 'login failed' }] };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: any) {
    sendRefreshToken(res, '');
    return true;
  }

  @Query(() => User, { nullable: true }) // Query type needs to have its return type defined - can't infer type
  @UseMiddleware(isAuthenticated)
  async homePage(
    @Ctx() { req, res }: requestContext
  ) {
    if (req && req.session && req.session.user) {
      return User.findOne({ where: { id: req.session.user.id }})
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