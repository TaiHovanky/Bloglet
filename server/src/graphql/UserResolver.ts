import bcrypt from 'bcryptjs';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { User } from '../entity/User';

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
}