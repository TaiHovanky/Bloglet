import { ObjectType } from 'type-graphql';
import { Entity, BaseEntity, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@ObjectType()
@Entity('likes')
export class Post extends BaseEntity {

  @PrimaryColumn('int') usersId: number;

  @PrimaryColumn('int') postsId: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => Post)
  @JoinColumn()
  post: Post;
}