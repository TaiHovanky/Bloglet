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
  async registerUser(
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('age') age: number,
    @Arg('email') email: string,
    @Arg('password') password: string
  ) {
    /* Hash the password and then insert the user data and hashed password into db. */
    const hashedPassword = await bcrypt.hash(password, 12);

    await User.insert({
      firstName,
      lastName,
      age,
      email,
      password: hashedPassword
    })
    .catch((err) => {
      console.error(err);
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
          { data: `${email}-${id}` }, 'secret', { expiresIn: '30m' }
        );
        return { token, user };
      }
    } else {
      return errorHandler('Invalid password', res);
    }
    console.log('final error handler');
    return errorHandler('Login failed', res);
  }
}