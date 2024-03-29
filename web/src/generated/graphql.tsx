import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Comment = {
  __typename?: 'Comment';
  id: Scalars['Float'];
  comment: Scalars['String'];
  createdAt: Scalars['String'];
  user?: Maybe<User>;
  post?: Maybe<Post>;
  likes?: Maybe<Array<CommentLike>>;
};

export type CommentLike = {
  __typename?: 'CommentLike';
  id: Scalars['Float'];
  user?: Maybe<User>;
  comment?: Maybe<Comment>;
};


export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Follows = {
  __typename?: 'Follows';
  id: Scalars['Float'];
  follower?: Maybe<User>;
  following?: Maybe<User>;
};

export type Mutation = {
  __typename?: 'Mutation';
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  createPost?: Maybe<Post>;
  likePost?: Maybe<Post>;
  deletePost?: Maybe<Scalars['Boolean']>;
  followUser?: Maybe<Follows>;
  createComment?: Maybe<Post>;
  likeComment?: Maybe<Comment>;
};


export type MutationRegisterArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
  lastName: Scalars['String'];
  firstName: Scalars['String'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
};


export type MutationCreatePostArgs = {
  content: Scalars['String'];
  creatorId: Scalars['Float'];
};


export type MutationLikePostArgs = {
  isAlreadyLiked: Scalars['Boolean'];
  userId: Scalars['Float'];
  postId: Scalars['Float'];
};


export type MutationDeletePostArgs = {
  postId: Scalars['Float'];
};


export type MutationFollowUserArgs = {
  isAlreadyFollowing: Scalars['Boolean'];
  userToBeFollowed: Scalars['Float'];
  loggedInUser: Scalars['Float'];
};


export type MutationCreateCommentArgs = {
  createdAt: Scalars['String'];
  comment: Scalars['String'];
  postId: Scalars['Float'];
  userId: Scalars['Float'];
};


export type MutationLikeCommentArgs = {
  isAlreadyLiked: Scalars['Boolean'];
  commentId: Scalars['Float'];
  userId: Scalars['Float'];
};

export type Post = {
  __typename?: 'Post';
  id: Scalars['Float'];
  content?: Maybe<Scalars['String']>;
  creatorId: Scalars['Float'];
  createdAt?: Maybe<Scalars['DateTime']>;
  likes?: Maybe<Array<PostLike>>;
  comments?: Maybe<Array<Comment>>;
  user?: Maybe<User>;
};

export type PostLike = {
  __typename?: 'PostLike';
  id: Scalars['Float'];
  post: Post;
  user: User;
};

export type Query = {
  __typename?: 'Query';
  users: Array<User>;
  homePage?: Maybe<User>;
  searchUsers?: Maybe<Array<User>>;
  getUserPosts?: Maybe<Array<Post>>;
  getPost: Post;
  getFollowers?: Maybe<Array<Follows>>;
  getFollowing?: Maybe<Array<Follows>>;
};


export type QuerySearchUsersArgs = {
  name: Scalars['String'];
};


export type QueryGetUserPostsArgs = {
  isGettingNewsfeed: Scalars['Boolean'];
  offsetLimit: Scalars['Float'];
  cursor: Scalars['Float'];
  userId: Scalars['Float'];
};


export type QueryGetPostArgs = {
  postId: Scalars['Float'];
};


export type QueryGetFollowersArgs = {
  userId: Scalars['Float'];
};


export type QueryGetFollowingArgs = {
  userId: Scalars['Float'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Float'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  likedPosts?: Maybe<Array<PostLike>>;
  following?: Maybe<Array<Follows>>;
  followers?: Maybe<Array<Follows>>;
  comments?: Maybe<Array<Comment>>;
  likedComments?: Maybe<Array<CommentLike>>;
  posts?: Maybe<Array<Post>>;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type CreateCommentMutationVariables = Exact<{
  userId: Scalars['Float'];
  postId: Scalars['Float'];
  comment: Scalars['String'];
  createdAt: Scalars['String'];
}>;


export type CreateCommentMutation = (
  { __typename?: 'Mutation' }
  & { createComment?: Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'content' | 'createdAt'>
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>
    )>, likes?: Maybe<Array<(
      { __typename?: 'PostLike' }
      & { user: (
        { __typename?: 'User' }
        & Pick<User, 'id'>
      ) }
    )>>, comments?: Maybe<Array<(
      { __typename?: 'Comment' }
      & Pick<Comment, 'id' | 'comment' | 'createdAt'>
      & { likes?: Maybe<Array<(
        { __typename?: 'CommentLike' }
        & Pick<CommentLike, 'id'>
        & { user?: Maybe<(
          { __typename?: 'User' }
          & Pick<User, 'id'>
        )> }
      )>>, user?: Maybe<(
        { __typename?: 'User' }
        & Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>
      )>, post?: Maybe<(
        { __typename?: 'Post' }
        & Pick<Post, 'id'>
      )> }
    )>> }
  )> }
);

export type CreatePostMutationVariables = Exact<{
  creatorId: Scalars['Float'];
  content: Scalars['String'];
}>;


export type CreatePostMutation = (
  { __typename?: 'Mutation' }
  & { createPost?: Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'content' | 'createdAt'>
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>
    )>, likes?: Maybe<Array<(
      { __typename?: 'PostLike' }
      & { user: (
        { __typename?: 'User' }
        & Pick<User, 'id'>
      ) }
    )>>, comments?: Maybe<Array<(
      { __typename?: 'Comment' }
      & Pick<Comment, 'id' | 'comment' | 'createdAt'>
      & { likes?: Maybe<Array<(
        { __typename?: 'CommentLike' }
        & Pick<CommentLike, 'id'>
        & { user?: Maybe<(
          { __typename?: 'User' }
          & Pick<User, 'id'>
        )> }
      )>>, user?: Maybe<(
        { __typename?: 'User' }
        & Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>
      )>, post?: Maybe<(
        { __typename?: 'Post' }
        & Pick<Post, 'id'>
      )> }
    )>> }
  )> }
);

export type DeletePostMutationVariables = Exact<{
  postId: Scalars['Float'];
}>;


export type DeletePostMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deletePost'>
);

export type FollowUserMutationVariables = Exact<{
  userToBeFollowed: Scalars['Float'];
  loggedInUser: Scalars['Float'];
  isAlreadyFollowing: Scalars['Boolean'];
}>;


export type FollowUserMutation = (
  { __typename?: 'Mutation' }
  & { followUser?: Maybe<(
    { __typename?: 'Follows' }
    & Pick<Follows, 'id'>
    & { follower?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName' | 'lastName'>
    )> }
  )> }
);

export type GetFollowersQueryVariables = Exact<{
  userId: Scalars['Float'];
}>;


export type GetFollowersQuery = (
  { __typename?: 'Query' }
  & { getFollowers?: Maybe<Array<(
    { __typename?: 'Follows' }
    & Pick<Follows, 'id'>
    & { follower?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName' | 'lastName'>
    )> }
  )>> }
);

export type GetFollowingQueryVariables = Exact<{
  userId: Scalars['Float'];
}>;


export type GetFollowingQuery = (
  { __typename?: 'Query' }
  & { getFollowing?: Maybe<Array<(
    { __typename?: 'Follows' }
    & { following?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName' | 'lastName'>
    )> }
  )>> }
);

export type GetUserPostsQueryVariables = Exact<{
  userId: Scalars['Float'];
  cursor: Scalars['Float'];
  offsetLimit: Scalars['Float'];
  isGettingNewsfeed: Scalars['Boolean'];
}>;


export type GetUserPostsQuery = (
  { __typename?: 'Query' }
  & { getUserPosts?: Maybe<Array<(
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'content' | 'createdAt'>
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>
    )>, likes?: Maybe<Array<(
      { __typename?: 'PostLike' }
      & { user: (
        { __typename?: 'User' }
        & Pick<User, 'id'>
      ) }
    )>>, comments?: Maybe<Array<(
      { __typename?: 'Comment' }
      & Pick<Comment, 'id' | 'comment' | 'createdAt'>
      & { likes?: Maybe<Array<(
        { __typename?: 'CommentLike' }
        & Pick<CommentLike, 'id'>
        & { user?: Maybe<(
          { __typename?: 'User' }
          & Pick<User, 'id'>
        )> }
      )>>, user?: Maybe<(
        { __typename?: 'User' }
        & Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>
      )>, post?: Maybe<(
        { __typename?: 'Post' }
        & Pick<Post, 'id'>
      )> }
    )>> }
  )>> }
);

export type HomePageQueryVariables = Exact<{ [key: string]: never; }>;


export type HomePageQuery = (
  { __typename?: 'Query' }
  & { homePage?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>
  )> }
);

export type LikeCommentMutationVariables = Exact<{
  userId: Scalars['Float'];
  commentId: Scalars['Float'];
  isAlreadyLiked: Scalars['Boolean'];
}>;


export type LikeCommentMutation = (
  { __typename?: 'Mutation' }
  & { likeComment?: Maybe<(
    { __typename?: 'Comment' }
    & Pick<Comment, 'id' | 'comment' | 'createdAt'>
    & { likes?: Maybe<Array<(
      { __typename?: 'CommentLike' }
      & Pick<CommentLike, 'id'>
      & { user?: Maybe<(
        { __typename?: 'User' }
        & Pick<User, 'id'>
      )> }
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>
    )>, post?: Maybe<(
      { __typename?: 'Post' }
      & Pick<Post, 'id'>
    )> }
  )> }
);

export type LikePostMutationVariables = Exact<{
  userId: Scalars['Float'];
  postId: Scalars['Float'];
  isAlreadyLiked: Scalars['Boolean'];
}>;


export type LikePostMutation = (
  { __typename?: 'Mutation' }
  & { likePost?: Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'content' | 'createdAt'>
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>
    )>, likes?: Maybe<Array<(
      { __typename?: 'PostLike' }
      & { user: (
        { __typename?: 'User' }
        & Pick<User, 'id'>
      ) }
    )>> }
  )> }
);

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>
    )>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>> }
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'email'>
    )>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>> }
  ) }
);

export type SearchUsersQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type SearchUsersQuery = (
  { __typename?: 'Query' }
  & { searchUsers?: Maybe<Array<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>
  )>> }
);


export const CreateCommentDocument = gql`
    mutation CreateComment($userId: Float!, $postId: Float!, $comment: String!, $createdAt: String!) {
  createComment(
    userId: $userId
    postId: $postId
    comment: $comment
    createdAt: $createdAt
  ) {
    id
    content
    createdAt
    user {
      id
      firstName
      lastName
      email
    }
    likes {
      user {
        id
      }
    }
    comments {
      id
      comment
      createdAt
      likes {
        id
        user {
          id
        }
      }
      user {
        id
        firstName
        lastName
        email
      }
      post {
        id
      }
    }
  }
}
    `;
export type CreateCommentMutationFn = Apollo.MutationFunction<CreateCommentMutation, CreateCommentMutationVariables>;

/**
 * __useCreateCommentMutation__
 *
 * To run a mutation, you first call `useCreateCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCommentMutation, { data, loading, error }] = useCreateCommentMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      postId: // value for 'postId'
 *      comment: // value for 'comment'
 *      createdAt: // value for 'createdAt'
 *   },
 * });
 */
export function useCreateCommentMutation(baseOptions?: Apollo.MutationHookOptions<CreateCommentMutation, CreateCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCommentMutation, CreateCommentMutationVariables>(CreateCommentDocument, options);
      }
export type CreateCommentMutationHookResult = ReturnType<typeof useCreateCommentMutation>;
export type CreateCommentMutationResult = Apollo.MutationResult<CreateCommentMutation>;
export type CreateCommentMutationOptions = Apollo.BaseMutationOptions<CreateCommentMutation, CreateCommentMutationVariables>;
export const CreatePostDocument = gql`
    mutation CreatePost($creatorId: Float!, $content: String!) {
  createPost(creatorId: $creatorId, content: $content) {
    id
    content
    createdAt
    user {
      id
      firstName
      lastName
      email
    }
    likes {
      user {
        id
      }
    }
    comments {
      id
      comment
      createdAt
      likes {
        id
        user {
          id
        }
      }
      user {
        id
        firstName
        lastName
        email
      }
      post {
        id
      }
    }
  }
}
    `;
export type CreatePostMutationFn = Apollo.MutationFunction<CreatePostMutation, CreatePostMutationVariables>;

/**
 * __useCreatePostMutation__
 *
 * To run a mutation, you first call `useCreatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPostMutation, { data, loading, error }] = useCreatePostMutation({
 *   variables: {
 *      creatorId: // value for 'creatorId'
 *      content: // value for 'content'
 *   },
 * });
 */
export function useCreatePostMutation(baseOptions?: Apollo.MutationHookOptions<CreatePostMutation, CreatePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument, options);
      }
export type CreatePostMutationHookResult = ReturnType<typeof useCreatePostMutation>;
export type CreatePostMutationResult = Apollo.MutationResult<CreatePostMutation>;
export type CreatePostMutationOptions = Apollo.BaseMutationOptions<CreatePostMutation, CreatePostMutationVariables>;
export const DeletePostDocument = gql`
    mutation DeletePost($postId: Float!) {
  deletePost(postId: $postId)
}
    `;
export type DeletePostMutationFn = Apollo.MutationFunction<DeletePostMutation, DeletePostMutationVariables>;

/**
 * __useDeletePostMutation__
 *
 * To run a mutation, you first call `useDeletePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePostMutation, { data, loading, error }] = useDeletePostMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useDeletePostMutation(baseOptions?: Apollo.MutationHookOptions<DeletePostMutation, DeletePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument, options);
      }
export type DeletePostMutationHookResult = ReturnType<typeof useDeletePostMutation>;
export type DeletePostMutationResult = Apollo.MutationResult<DeletePostMutation>;
export type DeletePostMutationOptions = Apollo.BaseMutationOptions<DeletePostMutation, DeletePostMutationVariables>;
export const FollowUserDocument = gql`
    mutation FollowUser($userToBeFollowed: Float!, $loggedInUser: Float!, $isAlreadyFollowing: Boolean!) {
  followUser(
    userToBeFollowed: $userToBeFollowed
    loggedInUser: $loggedInUser
    isAlreadyFollowing: $isAlreadyFollowing
  ) {
    id
    follower {
      id
      firstName
      lastName
    }
  }
}
    `;
export type FollowUserMutationFn = Apollo.MutationFunction<FollowUserMutation, FollowUserMutationVariables>;

/**
 * __useFollowUserMutation__
 *
 * To run a mutation, you first call `useFollowUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFollowUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [followUserMutation, { data, loading, error }] = useFollowUserMutation({
 *   variables: {
 *      userToBeFollowed: // value for 'userToBeFollowed'
 *      loggedInUser: // value for 'loggedInUser'
 *      isAlreadyFollowing: // value for 'isAlreadyFollowing'
 *   },
 * });
 */
export function useFollowUserMutation(baseOptions?: Apollo.MutationHookOptions<FollowUserMutation, FollowUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<FollowUserMutation, FollowUserMutationVariables>(FollowUserDocument, options);
      }
export type FollowUserMutationHookResult = ReturnType<typeof useFollowUserMutation>;
export type FollowUserMutationResult = Apollo.MutationResult<FollowUserMutation>;
export type FollowUserMutationOptions = Apollo.BaseMutationOptions<FollowUserMutation, FollowUserMutationVariables>;
export const GetFollowersDocument = gql`
    query GetFollowers($userId: Float!) {
  getFollowers(userId: $userId) {
    id
    follower {
      id
      firstName
      lastName
    }
  }
}
    `;

/**
 * __useGetFollowersQuery__
 *
 * To run a query within a React component, call `useGetFollowersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFollowersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFollowersQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetFollowersQuery(baseOptions: Apollo.QueryHookOptions<GetFollowersQuery, GetFollowersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFollowersQuery, GetFollowersQueryVariables>(GetFollowersDocument, options);
      }
export function useGetFollowersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFollowersQuery, GetFollowersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFollowersQuery, GetFollowersQueryVariables>(GetFollowersDocument, options);
        }
export type GetFollowersQueryHookResult = ReturnType<typeof useGetFollowersQuery>;
export type GetFollowersLazyQueryHookResult = ReturnType<typeof useGetFollowersLazyQuery>;
export type GetFollowersQueryResult = Apollo.QueryResult<GetFollowersQuery, GetFollowersQueryVariables>;
export const GetFollowingDocument = gql`
    query GetFollowing($userId: Float!) {
  getFollowing(userId: $userId) {
    following {
      id
      firstName
      lastName
    }
  }
}
    `;

/**
 * __useGetFollowingQuery__
 *
 * To run a query within a React component, call `useGetFollowingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFollowingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFollowingQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetFollowingQuery(baseOptions: Apollo.QueryHookOptions<GetFollowingQuery, GetFollowingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFollowingQuery, GetFollowingQueryVariables>(GetFollowingDocument, options);
      }
export function useGetFollowingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFollowingQuery, GetFollowingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFollowingQuery, GetFollowingQueryVariables>(GetFollowingDocument, options);
        }
export type GetFollowingQueryHookResult = ReturnType<typeof useGetFollowingQuery>;
export type GetFollowingLazyQueryHookResult = ReturnType<typeof useGetFollowingLazyQuery>;
export type GetFollowingQueryResult = Apollo.QueryResult<GetFollowingQuery, GetFollowingQueryVariables>;
export const GetUserPostsDocument = gql`
    query GetUserPosts($userId: Float!, $cursor: Float!, $offsetLimit: Float!, $isGettingNewsfeed: Boolean!) {
  getUserPosts(
    userId: $userId
    cursor: $cursor
    offsetLimit: $offsetLimit
    isGettingNewsfeed: $isGettingNewsfeed
  ) {
    id
    content
    createdAt
    user {
      id
      firstName
      lastName
      email
    }
    likes {
      user {
        id
      }
    }
    comments {
      id
      comment
      createdAt
      likes {
        id
        user {
          id
        }
      }
      user {
        id
        firstName
        lastName
        email
      }
      post {
        id
      }
    }
  }
}
    `;

/**
 * __useGetUserPostsQuery__
 *
 * To run a query within a React component, call `useGetUserPostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserPostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserPostsQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *      cursor: // value for 'cursor'
 *      offsetLimit: // value for 'offsetLimit'
 *      isGettingNewsfeed: // value for 'isGettingNewsfeed'
 *   },
 * });
 */
export function useGetUserPostsQuery(baseOptions: Apollo.QueryHookOptions<GetUserPostsQuery, GetUserPostsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserPostsQuery, GetUserPostsQueryVariables>(GetUserPostsDocument, options);
      }
export function useGetUserPostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserPostsQuery, GetUserPostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserPostsQuery, GetUserPostsQueryVariables>(GetUserPostsDocument, options);
        }
export type GetUserPostsQueryHookResult = ReturnType<typeof useGetUserPostsQuery>;
export type GetUserPostsLazyQueryHookResult = ReturnType<typeof useGetUserPostsLazyQuery>;
export type GetUserPostsQueryResult = Apollo.QueryResult<GetUserPostsQuery, GetUserPostsQueryVariables>;
export const HomePageDocument = gql`
    query HomePage {
  homePage {
    id
    firstName
    lastName
    email
  }
}
    `;

/**
 * __useHomePageQuery__
 *
 * To run a query within a React component, call `useHomePageQuery` and pass it any options that fit your needs.
 * When your component renders, `useHomePageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHomePageQuery({
 *   variables: {
 *   },
 * });
 */
export function useHomePageQuery(baseOptions?: Apollo.QueryHookOptions<HomePageQuery, HomePageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HomePageQuery, HomePageQueryVariables>(HomePageDocument, options);
      }
export function useHomePageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HomePageQuery, HomePageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HomePageQuery, HomePageQueryVariables>(HomePageDocument, options);
        }
export type HomePageQueryHookResult = ReturnType<typeof useHomePageQuery>;
export type HomePageLazyQueryHookResult = ReturnType<typeof useHomePageLazyQuery>;
export type HomePageQueryResult = Apollo.QueryResult<HomePageQuery, HomePageQueryVariables>;
export const LikeCommentDocument = gql`
    mutation LikeComment($userId: Float!, $commentId: Float!, $isAlreadyLiked: Boolean!) {
  likeComment(
    userId: $userId
    commentId: $commentId
    isAlreadyLiked: $isAlreadyLiked
  ) {
    id
    comment
    createdAt
    likes {
      id
      user {
        id
      }
    }
    user {
      id
      firstName
      lastName
      email
    }
    post {
      id
    }
  }
}
    `;
export type LikeCommentMutationFn = Apollo.MutationFunction<LikeCommentMutation, LikeCommentMutationVariables>;

/**
 * __useLikeCommentMutation__
 *
 * To run a mutation, you first call `useLikeCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLikeCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [likeCommentMutation, { data, loading, error }] = useLikeCommentMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      commentId: // value for 'commentId'
 *      isAlreadyLiked: // value for 'isAlreadyLiked'
 *   },
 * });
 */
export function useLikeCommentMutation(baseOptions?: Apollo.MutationHookOptions<LikeCommentMutation, LikeCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LikeCommentMutation, LikeCommentMutationVariables>(LikeCommentDocument, options);
      }
export type LikeCommentMutationHookResult = ReturnType<typeof useLikeCommentMutation>;
export type LikeCommentMutationResult = Apollo.MutationResult<LikeCommentMutation>;
export type LikeCommentMutationOptions = Apollo.BaseMutationOptions<LikeCommentMutation, LikeCommentMutationVariables>;
export const LikePostDocument = gql`
    mutation LikePost($userId: Float!, $postId: Float!, $isAlreadyLiked: Boolean!) {
  likePost(userId: $userId, postId: $postId, isAlreadyLiked: $isAlreadyLiked) {
    id
    content
    createdAt
    user {
      id
      firstName
      lastName
      email
    }
    likes {
      user {
        id
      }
    }
  }
}
    `;
export type LikePostMutationFn = Apollo.MutationFunction<LikePostMutation, LikePostMutationVariables>;

/**
 * __useLikePostMutation__
 *
 * To run a mutation, you first call `useLikePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLikePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [likePostMutation, { data, loading, error }] = useLikePostMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      postId: // value for 'postId'
 *      isAlreadyLiked: // value for 'isAlreadyLiked'
 *   },
 * });
 */
export function useLikePostMutation(baseOptions?: Apollo.MutationHookOptions<LikePostMutation, LikePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LikePostMutation, LikePostMutationVariables>(LikePostDocument, options);
      }
export type LikePostMutationHookResult = ReturnType<typeof useLikePostMutation>;
export type LikePostMutationResult = Apollo.MutationResult<LikePostMutation>;
export type LikePostMutationOptions = Apollo.BaseMutationOptions<LikePostMutation, LikePostMutationVariables>;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    user {
      id
      email
      firstName
      lastName
    }
    errors {
      field
      message
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
  register(
    firstName: $firstName
    lastName: $lastName
    email: $email
    password: $password
  ) {
    user {
      id
      email
    }
    errors {
      field
      message
    }
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      firstName: // value for 'firstName'
 *      lastName: // value for 'lastName'
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const SearchUsersDocument = gql`
    query searchUsers($name: String!) {
  searchUsers(name: $name) {
    id
    firstName
    lastName
    email
  }
}
    `;

/**
 * __useSearchUsersQuery__
 *
 * To run a query within a React component, call `useSearchUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchUsersQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useSearchUsersQuery(baseOptions: Apollo.QueryHookOptions<SearchUsersQuery, SearchUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument, options);
      }
export function useSearchUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchUsersQuery, SearchUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument, options);
        }
export type SearchUsersQueryHookResult = ReturnType<typeof useSearchUsersQuery>;
export type SearchUsersLazyQueryHookResult = ReturnType<typeof useSearchUsersLazyQuery>;
export type SearchUsersQueryResult = Apollo.QueryResult<SearchUsersQuery, SearchUsersQueryVariables>;