import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { gql } from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export enum Category {
  CINEMA = 'CINEMA',
  CUISINE = 'CUISINE',
  DIY = 'DIY',
  FASHION = 'FASHION',
  LIFESTYLE = 'LIFESTYLE',
  TECHNOLOGY = 'TECHNOLOGY',
  TRAVEL = 'TRAVEL'
}

export type Comment = {
  __typename?: 'Comment';
  /** Author of blog comment */
  author: User;
  /** Date Entity was created. */
  createdAt: Scalars['DateTime']['output'];
  /** Comment ID */
  id: Scalars['Int']['output'];
  likeCount: Scalars['Int']['output'];
  /** Post that was commented on */
  post: Post;
  text: Scalars['String']['output'];
  /** Date Entity was last updated. */
  updatedAt: Scalars['DateTime']['output'];
};

export type CreateCommentInput = {
  /** ID of Post that was commented on */
  postId: Scalars['Int']['input'];
  /** Comment text content */
  text: Scalars['String']['input'];
};

export type CreateLikeInput = {
  /** Comment with like */
  commentId?: InputMaybe<Scalars['Int']['input']>;
  /** Post with like */
  postId?: InputMaybe<Scalars['Int']['input']>;
};

export type CreatePostInput = {
  /** Blog post category */
  category: Category;
  /** Blog post content */
  content: Scalars['String']['input'];
  /** Blog post short description */
  desc: Scalars['String']['input'];
  /** Blog post image URL */
  image: Scalars['String']['input'];
  /** Blog post tags */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Blog post title */
  title: Scalars['String']['input'];
};

export type CreateUserInput = {
  /** User display photo (avatar) */
  avatar?: InputMaybe<Scalars['String']['input']>;
  /** User confirm password */
  confirmPassword: Scalars['String']['input'];
  /** User email address */
  email: Scalars['String']['input'];
  /** User password */
  password: Scalars['String']['input'];
  /** Username */
  username: Scalars['String']['input'];
};

export enum EntityOwnsLike {
  COMMENT = 'COMMENT',
  POST = 'POST'
}

export type Like = {
  __typename?: 'Like';
  /** Comment that was liked */
  comment?: Maybe<Comment>;
  /** Date Entity was created. */
  createdAt: Scalars['DateTime']['output'];
  /** Likes Collection ID */
  id: Scalars['Int']['output'];
  /** User who liked post. */
  owner: User;
  /** Post that was liked */
  post?: Maybe<Post>;
  /** Date Entity was last updated. */
  updatedAt: Scalars['DateTime']['output'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  access_token: Scalars['String']['output'];
  user: User;
};

export type LoginUserInput = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createComment: Comment;
  createPost: Post;
  followUser: User;
  getOAuthUrl: Scalars['String']['output'];
  login: LoginResponse;
  markAllNotificationsAsRead: Scalars['Boolean']['output'];
  markNotificationAsRead: Notification;
  oauthLogin: LoginResponse;
  removeComment: Comment;
  removeLike: Like;
  removePost: Post;
  removeUser: User;
  signup: User;
  toggleLike: Like;
  trackPostView: Scalars['Boolean']['output'];
  unFollowUser: User;
  updateComment: Comment;
  updatePost: Post;
  updateUser: User;
};


export type MutationCreateCommentArgs = {
  createCommentInput: CreateCommentInput;
};


export type MutationCreatePostArgs = {
  createPostInput: CreatePostInput;
};


export type MutationFollowUserArgs = {
  userToBeFollowedId: Scalars['String']['input'];
};


export type MutationGetOAuthUrlArgs = {
  provider: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  loginUserInput: LoginUserInput;
};


export type MutationMarkNotificationAsReadArgs = {
  id: Scalars['String']['input'];
};


export type MutationOauthLoginArgs = {
  oauthInput: OAuthInput;
};


export type MutationRemoveCommentArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveLikeArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemovePostArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveUserArgs = {
  id: Scalars['String']['input'];
};


export type MutationSignupArgs = {
  createUserInput: CreateUserInput;
};


export type MutationToggleLikeArgs = {
  createLikeInput: CreateLikeInput;
};


export type MutationTrackPostViewArgs = {
  slug: Scalars['String']['input'];
};


export type MutationUnFollowUserArgs = {
  userToBeUnfollowedId: Scalars['String']['input'];
};


export type MutationUpdateCommentArgs = {
  updateCommentInput: UpdateCommentInput;
};


export type MutationUpdatePostArgs = {
  updatePostInput: UpdatePostInput;
};


export type MutationUpdateUserArgs = {
  updateUserInput: UpdateUserInput;
};

export type Notification = {
  __typename?: 'Notification';
  actor?: Maybe<User>;
  /** Date Entity was created. */
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  message: Scalars['String']['output'];
  read: Scalars['Boolean']['output'];
  recipient: User;
  resourceId?: Maybe<Scalars['Int']['output']>;
  type: Scalars['String']['output'];
  /** Date Entity was last updated. */
  updatedAt: Scalars['DateTime']['output'];
};

export type OAuthInput = {
  code: Scalars['String']['input'];
  provider: Scalars['String']['input'];
  redirectUri?: InputMaybe<Scalars['String']['input']>;
};

export type Post = {
  __typename?: 'Post';
  author: User;
  category: Category;
  commentCount: Scalars['Int']['output'];
  comments?: Maybe<Array<Comment>>;
  content: Scalars['String']['output'];
  /** Date Entity was created. */
  createdAt: Scalars['DateTime']['output'];
  /** Date Entity was deleted. */
  deletedAt: Scalars['DateTime']['output'];
  desc: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  image: Scalars['String']['output'];
  likeCount: Scalars['Int']['output'];
  slug: Scalars['String']['output'];
  tags?: Maybe<Array<Tag>>;
  title: Scalars['String']['output'];
  /** Date Entity was last updated. */
  updatedAt: Scalars['DateTime']['output'];
  views: Scalars['Int']['output'];
};

export type PostAnalytics = {
  __typename?: 'PostAnalytics';
  comments: Scalars['Int']['output'];
  engagementRate: Scalars['Float']['output'];
  likes: Scalars['Int']['output'];
  views: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  auth: Scalars['String']['output'];
  checkJwt: Scalars['Boolean']['output'];
  comment?: Maybe<Comment>;
  comments?: Maybe<Array<Comment>>;
  findUserById: User;
  followers: Array<User>;
  following: Array<User>;
  hasUserLiked: Scalars['Boolean']['output'];
  like: Like;
  likeCount: Scalars['Int']['output'];
  likes: Array<Like>;
  notifications: Array<Notification>;
  /** Get most popular posts ordered by likes */
  popularPosts?: Maybe<Array<Post>>;
  post: Post;
  postAnalytics: PostAnalytics;
  /** Get total count of posts with optional filtering */
  postCount: Scalars['Int']['output'];
  /** Get posts with optional filtering by category and/or author */
  posts: Array<Post>;
  /** Get all posts by a specific author */
  postsByAuthor?: Maybe<Array<Post>>;
  /** Get all posts in a specific category */
  postsByCategory?: Maybe<Array<Post>>;
  /** Get most recent posts */
  recentPosts?: Maybe<Array<Post>>;
  searchPosts: Array<Post>;
  searchTags: Array<Tag>;
  searchUsers: Array<User>;
  tags: Array<Tag>;
  trendingTags: Array<TrendingTag>;
  unreadNotificationsCount: Scalars['Int']['output'];
  user: User;
  userAnalytics: UserAnalytics;
  whoami: User;
};


export type QueryCommentArgs = {
  id: Scalars['Int']['input'];
};


export type QueryCommentsArgs = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  postId: Scalars['Int']['input'];
};


export type QueryFindUserByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryFollowersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  username: Scalars['String']['input'];
};


export type QueryFollowingArgs = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  username: Scalars['String']['input'];
};


export type QueryHasUserLikedArgs = {
  entity: EntityOwnsLike;
  entityId: Scalars['Int']['input'];
};


export type QueryLikeArgs = {
  id: Scalars['Int']['input'];
};


export type QueryLikeCountArgs = {
  entity: EntityOwnsLike;
  id: Scalars['Int']['input'];
};


export type QueryLikesArgs = {
  entity: EntityOwnsLike;
  id: Scalars['Int']['input'];
};


export type QueryNotificationsArgs = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type QueryPopularPostsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPostArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPostAnalyticsArgs = {
  slug: Scalars['String']['input'];
};


export type QueryPostCountArgs = {
  authorId?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Category>;
};


export type QueryPostsArgs = {
  authorId?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Category>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPostsByAuthorArgs = {
  authorId: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPostsByCategoryArgs = {
  category: Category;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRecentPostsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySearchPostsArgs = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  query: Scalars['String']['input'];
};


export type QuerySearchTagsArgs = {
  limit?: Scalars['Int']['input'];
  query: Scalars['String']['input'];
};


export type QuerySearchUsersArgs = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  query: Scalars['String']['input'];
};


export type QueryTrendingTagsArgs = {
  limit?: Scalars['Int']['input'];
  timeRange?: Scalars['String']['input'];
};


export type QueryUserArgs = {
  username: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  notificationAdded: Notification;
};

export type Tag = {
  __typename?: 'Tag';
  /** Date Entity was created. */
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  posts?: Maybe<Array<Post>>;
  /** Date Entity was last updated. */
  updatedAt: Scalars['DateTime']['output'];
};

export type TrendingTag = {
  __typename?: 'TrendingTag';
  count: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type UpdateCommentInput = {
  /** ID of comment to be updated. */
  id: Scalars['Int']['input'];
  /** Comment text content */
  text: Scalars['String']['input'];
};

export type UpdatePostInput = {
  /** Blog post content category */
  category?: InputMaybe<Category>;
  /** Blog post content */
  content?: InputMaybe<Scalars['String']['input']>;
  /** Blog post short description */
  desc?: InputMaybe<Scalars['String']['input']>;
  /** Post id to be updated. */
  id: Scalars['Int']['input'];
  /** Blog post image URL */
  image?: InputMaybe<Scalars['String']['input']>;
  /** Blog post tags */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  /** User display photo (avatar) */
  avatar?: InputMaybe<Scalars['String']['input']>;
  /** User confirm password */
  confirmPassword?: InputMaybe<Scalars['String']['input']>;
  /** User email address */
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  /** User password */
  password?: InputMaybe<Scalars['String']['input']>;
  /** Username */
  username?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  avatar?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  /** Date Entity was created. */
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  /** Email verification status */
  emailVerified: Scalars['Boolean']['output'];
  followerCount: Scalars['Int']['output'];
  followingCount: Scalars['Int']['output'];
  /** ID */
  id: Scalars['String']['output'];
  isFollowing: Scalars['Boolean']['output'];
  /** OAuth2 ID */
  oauthId?: Maybe<Scalars['String']['output']>;
  /** OAuth2 Provider name, e.g. Google, GitHub.. */
  oauthProvider?: Maybe<Scalars['String']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  /** Date Entity was last updated. */
  updatedAt: Scalars['DateTime']['output'];
  username: Scalars['String']['output'];
};

export type UserAnalytics = {
  __typename?: 'UserAnalytics';
  engagementRate: Scalars['Float']['output'];
  postViews: Scalars['Int']['output'];
  totalComments: Scalars['Int']['output'];
  totalFollowers: Scalars['Int']['output'];
  totalFollowing: Scalars['Int']['output'];
  totalLikes: Scalars['Int']['output'];
  totalPosts: Scalars['Int']['output'];
};

export type UserInputType = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  /** Email verification status */
  emailVerified?: Scalars['Boolean']['input'];
  followerCount?: Scalars['Int']['input'];
  followingCount?: Scalars['Int']['input'];
  /** ID */
  id: Scalars['String']['input'];
  /** OAuth2 ID */
  oauthId?: InputMaybe<Scalars['String']['input']>;
  /** OAuth2 Provider name, e.g. Google, GitHub.. */
  oauthProvider?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  username: Scalars['String']['input'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Category: Category;
  Comment: ResolverTypeWrapper<Comment>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  CreateCommentInput: CreateCommentInput;
  CreateLikeInput: CreateLikeInput;
  CreatePostInput: CreatePostInput;
  CreateUserInput: CreateUserInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  EntityOwnsLike: EntityOwnsLike;
  Like: ResolverTypeWrapper<Like>;
  LoginResponse: ResolverTypeWrapper<LoginResponse>;
  LoginUserInput: LoginUserInput;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Notification: ResolverTypeWrapper<Notification>;
  OAuthInput: OAuthInput;
  Post: ResolverTypeWrapper<Post>;
  PostAnalytics: ResolverTypeWrapper<PostAnalytics>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Subscription: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Tag: ResolverTypeWrapper<Tag>;
  TrendingTag: ResolverTypeWrapper<TrendingTag>;
  UpdateCommentInput: UpdateCommentInput;
  UpdatePostInput: UpdatePostInput;
  UpdateUserInput: UpdateUserInput;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  User: ResolverTypeWrapper<User>;
  UserAnalytics: ResolverTypeWrapper<UserAnalytics>;
  userInputType: UserInputType;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Comment: Comment;
  Int: Scalars['Int']['output'];
  CreateCommentInput: CreateCommentInput;
  CreateLikeInput: CreateLikeInput;
  CreatePostInput: CreatePostInput;
  CreateUserInput: CreateUserInput;
  DateTime: Scalars['DateTime']['output'];
  Like: Like;
  LoginResponse: LoginResponse;
  LoginUserInput: LoginUserInput;
  Mutation: Record<PropertyKey, never>;
  Boolean: Scalars['Boolean']['output'];
  Notification: Notification;
  OAuthInput: OAuthInput;
  Post: Post;
  PostAnalytics: PostAnalytics;
  Float: Scalars['Float']['output'];
  Query: Record<PropertyKey, never>;
  Subscription: Record<PropertyKey, never>;
  Tag: Tag;
  TrendingTag: TrendingTag;
  UpdateCommentInput: UpdateCommentInput;
  UpdatePostInput: UpdatePostInput;
  UpdateUserInput: UpdateUserInput;
  ID: Scalars['ID']['output'];
  User: User;
  UserAnalytics: UserAnalytics;
  userInputType: UserInputType;
  String: Scalars['String']['output'];
};

export type NgModuleDirectiveArgs = {
  module: Scalars['String']['input'];
};

export type NgModuleDirectiveResolver<Result, Parent, ContextType = any, Args = NgModuleDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type NamedClientDirectiveArgs = {
  name: Scalars['String']['input'];
};

export type NamedClientDirectiveResolver<Result, Parent, ContextType = any, Args = NamedClientDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type CommentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment']> = {
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  likeCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  post?: Resolver<ResolversTypes['Post'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type LikeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Like'] = ResolversParentTypes['Like']> = {
  comment?: Resolver<Maybe<ResolversTypes['Comment']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  post?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type LoginResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginResponse'] = ResolversParentTypes['LoginResponse']> = {
  access_token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createComment?: Resolver<ResolversTypes['Comment'], ParentType, ContextType, RequireFields<MutationCreateCommentArgs, 'createCommentInput'>>;
  createPost?: Resolver<ResolversTypes['Post'], ParentType, ContextType, RequireFields<MutationCreatePostArgs, 'createPostInput'>>;
  followUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationFollowUserArgs, 'userToBeFollowedId'>>;
  getOAuthUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationGetOAuthUrlArgs, 'provider'>>;
  login?: Resolver<ResolversTypes['LoginResponse'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'loginUserInput'>>;
  markAllNotificationsAsRead?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  markNotificationAsRead?: Resolver<ResolversTypes['Notification'], ParentType, ContextType, RequireFields<MutationMarkNotificationAsReadArgs, 'id'>>;
  oauthLogin?: Resolver<ResolversTypes['LoginResponse'], ParentType, ContextType, RequireFields<MutationOauthLoginArgs, 'oauthInput'>>;
  removeComment?: Resolver<ResolversTypes['Comment'], ParentType, ContextType, RequireFields<MutationRemoveCommentArgs, 'id'>>;
  removeLike?: Resolver<ResolversTypes['Like'], ParentType, ContextType, RequireFields<MutationRemoveLikeArgs, 'id'>>;
  removePost?: Resolver<ResolversTypes['Post'], ParentType, ContextType, RequireFields<MutationRemovePostArgs, 'id'>>;
  removeUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationRemoveUserArgs, 'id'>>;
  signup?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationSignupArgs, 'createUserInput'>>;
  toggleLike?: Resolver<ResolversTypes['Like'], ParentType, ContextType, RequireFields<MutationToggleLikeArgs, 'createLikeInput'>>;
  trackPostView?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationTrackPostViewArgs, 'slug'>>;
  unFollowUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUnFollowUserArgs, 'userToBeUnfollowedId'>>;
  updateComment?: Resolver<ResolversTypes['Comment'], ParentType, ContextType, RequireFields<MutationUpdateCommentArgs, 'updateCommentInput'>>;
  updatePost?: Resolver<ResolversTypes['Post'], ParentType, ContextType, RequireFields<MutationUpdatePostArgs, 'updatePostInput'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'updateUserInput'>>;
};

export type NotificationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Notification'] = ResolversParentTypes['Notification']> = {
  actor?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  read?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  recipient?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  resourceId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type PostResolvers<ContextType = any, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = {
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  category?: Resolver<ResolversTypes['Category'], ParentType, ContextType>;
  commentCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  comments?: Resolver<Maybe<Array<ResolversTypes['Comment']>>, ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  deletedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  desc?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  image?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  likeCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<ResolversTypes['Tag']>>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  views?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type PostAnalyticsResolvers<ContextType = any, ParentType extends ResolversParentTypes['PostAnalytics'] = ResolversParentTypes['PostAnalytics']> = {
  comments?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  engagementRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  likes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  views?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  auth?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  checkJwt?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  comment?: Resolver<Maybe<ResolversTypes['Comment']>, ParentType, ContextType, RequireFields<QueryCommentArgs, 'id'>>;
  comments?: Resolver<Maybe<Array<ResolversTypes['Comment']>>, ParentType, ContextType, RequireFields<QueryCommentsArgs, 'limit' | 'offset' | 'postId'>>;
  findUserById?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryFindUserByIdArgs, 'id'>>;
  followers?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryFollowersArgs, 'limit' | 'offset' | 'username'>>;
  following?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryFollowingArgs, 'limit' | 'offset' | 'username'>>;
  hasUserLiked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<QueryHasUserLikedArgs, 'entity' | 'entityId'>>;
  like?: Resolver<ResolversTypes['Like'], ParentType, ContextType, RequireFields<QueryLikeArgs, 'id'>>;
  likeCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<QueryLikeCountArgs, 'entity' | 'id'>>;
  likes?: Resolver<Array<ResolversTypes['Like']>, ParentType, ContextType, RequireFields<QueryLikesArgs, 'entity' | 'id'>>;
  notifications?: Resolver<Array<ResolversTypes['Notification']>, ParentType, ContextType, RequireFields<QueryNotificationsArgs, 'limit' | 'offset'>>;
  popularPosts?: Resolver<Maybe<Array<ResolversTypes['Post']>>, ParentType, ContextType, RequireFields<QueryPopularPostsArgs, 'limit'>>;
  post?: Resolver<ResolversTypes['Post'], ParentType, ContextType, Partial<QueryPostArgs>>;
  postAnalytics?: Resolver<ResolversTypes['PostAnalytics'], ParentType, ContextType, RequireFields<QueryPostAnalyticsArgs, 'slug'>>;
  postCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<QueryPostCountArgs>>;
  posts?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType, Partial<QueryPostsArgs>>;
  postsByAuthor?: Resolver<Maybe<Array<ResolversTypes['Post']>>, ParentType, ContextType, RequireFields<QueryPostsByAuthorArgs, 'authorId'>>;
  postsByCategory?: Resolver<Maybe<Array<ResolversTypes['Post']>>, ParentType, ContextType, RequireFields<QueryPostsByCategoryArgs, 'category'>>;
  recentPosts?: Resolver<Maybe<Array<ResolversTypes['Post']>>, ParentType, ContextType, RequireFields<QueryRecentPostsArgs, 'limit'>>;
  searchPosts?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<QuerySearchPostsArgs, 'limit' | 'offset' | 'query'>>;
  searchTags?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType, RequireFields<QuerySearchTagsArgs, 'limit' | 'query'>>;
  searchUsers?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QuerySearchUsersArgs, 'limit' | 'offset' | 'query'>>;
  tags?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType>;
  trendingTags?: Resolver<Array<ResolversTypes['TrendingTag']>, ParentType, ContextType, RequireFields<QueryTrendingTagsArgs, 'limit' | 'timeRange'>>;
  unreadNotificationsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryUserArgs, 'username'>>;
  userAnalytics?: Resolver<ResolversTypes['UserAnalytics'], ParentType, ContextType>;
  whoami?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  notificationAdded?: SubscriptionResolver<ResolversTypes['Notification'], "notificationAdded", ParentType, ContextType>;
};

export type TagResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tag'] = ResolversParentTypes['Tag']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  posts?: Resolver<Maybe<Array<ResolversTypes['Post']>>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type TrendingTagResolvers<ContextType = any, ParentType extends ResolversParentTypes['TrendingTag'] = ResolversParentTypes['TrendingTag']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  emailVerified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  followerCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  followingCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isFollowing?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  oauthId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  oauthProvider?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  password?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type UserAnalyticsResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserAnalytics'] = ResolversParentTypes['UserAnalytics']> = {
  engagementRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  postViews?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalComments?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalFollowers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalFollowing?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalLikes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalPosts?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Comment?: CommentResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Like?: LikeResolvers<ContextType>;
  LoginResponse?: LoginResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Notification?: NotificationResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  PostAnalytics?: PostAnalyticsResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Tag?: TagResolvers<ContextType>;
  TrendingTag?: TrendingTagResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserAnalytics?: UserAnalyticsResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = any> = {
  NgModule?: NgModuleDirectiveResolver<any, any, ContextType>;
  namedClient?: NamedClientDirectiveResolver<any, any, ContextType>;
};
