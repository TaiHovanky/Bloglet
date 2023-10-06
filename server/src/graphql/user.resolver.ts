// @ts-ignore
import bcrypt, { compare } from 'bcryptjs';
import { Like } from 'typeorm';
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver, UseMiddleware } from 'type-graphql';
import { User } from '../entity/User';
import { requestContext } from '../types/context.interface';
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
  users() {
    return User.find({ relations: ['likedPosts']})
      .catch((err) => errorHandler(`Failed to get users: ${err}`));
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { req }: requestContext
  ) {
    if (password.length <= 2) {
      return {
        errors: [
          {
            field: "password",
            message: "Password must be greater than 2",
          },
        ],
      };
    }
    /* Hash the password and then insert the user data and hashed password into db. */
    // @ts-ignore
    const hashedPassword: any = await bcrypt.hash(password, 12) as any;
    try {
      const user = {
        firstName,
        lastName,
        email,
        password: hashedPassword
      };
      const userInsert = await User.insert(user);
      const newUser = {...userInsert.raw[0], ...user};
      req.session.user = newUser;
      return { user };
    } catch(err) {
      if (err.code === '23505') {
        return {
          errors: [
            {
              field: 'email',
              message: 'Email already taken',
            },
          ],
        };
      }
      return { errors: [{ field: 'registration', message: `Registration failed` }] };
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
    return { errors: [{ field: 'login', message: 'Login failed' }] };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: any) {
    return new Promise((resolve) =>
      req.session.destroy((err: any) => {
        res.clearCookie('connect.sid');
        req.session = null;
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }

  @Query(() => User, { nullable: true }) // Query type needs to have its return type defined - can't infer type
  @UseMiddleware(isAuthenticated)
  async homePage(
    @Ctx() { req }: requestContext
  ) {
    if (req && req.session && req.session.user) {
      return User.findOne({ where: { id: req.session.user.id }})
        .catch((err) => {
          errorHandler(`Home page user query failed: ${err}`);
          return null;
        });
    }
    return null;
  }

  @Query(() => [User], { nullable: true })
  @UseMiddleware(isAuthenticated)
  async searchUsers(
    @Arg('name') name: string
  ) {
    if (name) {
      return User.find({ where: { firstName: Like(`%${name}%`) }})
        .catch((err) => {
          errorHandler(`Search user query failed: ${err}`);
        });
    }
    return null;
  }
}