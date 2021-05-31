import bcrypt, { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/errorHandler';
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { User } from '../entity/User';
import { RequestContext } from './types';
import { sendRefreshToken } from '../utils/sendRefreshToken';

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
  users() {
    return User.find();
  }

  @Query(() => String)
  hello() {
    return 'hello';
  }

  @Mutation(() => Boolean)
  async register(
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('email') email: string,
    @Arg('password') password: string
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
      errorHandler('User registration failed', err);
      return false;
    });
    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { res }: RequestContext
  ) {
    /* Get the user from database using the email, then compare the password that was entered
    to the password from the db. Sign a JWT and return that. */
    const user = await User.findOne({ where: { email }});

    if (user) {
      const isPasswordValid: boolean = await compare(password, user.password);

      if (isPasswordValid) {
        const { email, tokenVersion, id } = user;
        const accessToken = await jwt.sign(
          { email },
          process.env.ACCESS_TOKEN_SECRET as string,
          { expiresIn: '30m' }
        );
        const refreshToken = await jwt.sign(
          { email, tokenVersion, id },
          process.env.REFRESH_TOKEN_SECRET as string,
          { expiresIn: '7d' }
        );

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
  async homePage(
    @Ctx() { req, res }: RequestContext
  ) {
    try {
      const authorization: string | undefined = req.headers['authorization'];

      if (authorization) {
        const accessToken: string = authorization.split(' ')[1];
        const payload: any = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string);
        return User.findOne({ where: { email: payload.email }});
      }
      // need to cast process.env.ACCESS_TOKEN_SECRET as a string or else string | undefined type error
      return null;
    } catch (err) {
      return errorHandler(`Unauthorized access - ${err}`, res);
    }
  }
}