import bcrypt, { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error-handler';
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { User } from '../entity/User';
import { RequestContext } from './types';

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
  async loginUser(
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
        const { email, id } = user;
        const token = await jwt.sign(
          { data: `${email}-${id}` }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '30m' }
        );
        return { token, user };
      }
    } else {
      return errorHandler('Invalid password', res);
    }
    console.log('final error handler');
    return errorHandler('Login failed', res);
  }

  @Query(() => User, { nullable: true }) // Query type needs to have its return type defined - can't infer type
  async homePage(
    @Ctx() { req, res }: RequestContext
  ) {
    const authorization: string | undefined = req.headers['authorization'];

    if (!authorization) {
      return errorHandler('Unauthorized access', res);
    }

    const accessToken: string = authorization.split(' ')[1];
    const payload: any = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string);
    // need to cast process.env.ACCESS_TOKEN_SECRET as a string or else string | undefined type error

    return User.findOne({ where: { email: payload.email }}).then((x) => console.log('success', x));
  }
}