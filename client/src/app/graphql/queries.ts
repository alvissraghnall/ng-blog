import { $, query } from '@gen';

export const getCurrentUser = query(q => [
  q.whoami(user => [user.id, user.username, user.email, user.avatar, user.bio, user.emailVerified]),
]);

export const getUserByUsername = query(q => [
  q.user({ username: $('username') }, user => [
    user.id,
    user.username,
    user.email,
    user.avatar,
    user.bio,
    user.emailVerified,
  ]),
]);

export const findUserById = query(q => [
  q.findUserById({ id: $('id') }, user => [
    user.id,
    user.username,
    user.email,
    user.avatar,
    user.bio,
    user.emailVerified,
  ]),
]);

export const getPost = query(q => [
  q.post({ id: $('id') }, post => [
    post.id,
    post.title,
    post.desc,
    post.content,
    post.image,
    post.category,
    post.likeCount,
    post.commentCount,
    post.author(author => [author.id, author.username, author.avatar]),
  ]),
]);

export const getAllPosts = query(q => [
  q.posts(
    {
      category: $('category'),
      authorId: $('authorId'),
      limit: $('limit'),
      offset: $('offset'),
    },
    post => [
      post.id,
      post.title,
      post.desc,
      post.content,
      post.image,
      post.category,
      post.likeCount,
      post.commentCount,
      post.author(author => [author.id, author.username, author.avatar]),
    ],
  ),
]);

export const getRecentPosts = query(q => [
  q.recentPosts({ limit: $('limit') }, post => [
    post.id,
    post.title,
    post.desc,
    post.image,
    post.category,
    post.likeCount,
    post.commentCount,
    post.author(author => [author.id, author.username, author.avatar]),
  ]),
]);

export const getPopularPosts = query(q => [
  q.popularPosts({ limit: $('limit') }, post => [
    post.id,
    post.title,
    post.desc,
    post.image,
    post.category,
    post.likeCount,
    post.commentCount,
    post.author(author => [author.id, author.username, author.avatar]),
  ]),
]);

export const getPostsByCategory = query(q => [
  q.postsByCategory(
    {
      category: $('category'),
      limit: $('limit'),
    },
    post => [
      post.id,
      post.title,
      post.desc,
      post.image,
      post.category,
      post.likeCount,
      post.commentCount,
      post.author(author => [author.id, author.username, author.avatar]),
    ],
  ),
]);

export const getPostsByAuthor = query(q => [
  q.postsByAuthor(
    {
      authorId: $('authorId'),
      limit: $('limit'),
    },
    post => [
      post.id,
      post.title,
      post.desc,
      post.image,
      post.category,
      post.likeCount,
      post.commentCount,
      post.author(author => [author.id, author.username, author.avatar]),
    ],
  ),
]);

export const getPostCount = query(q => [
  q.postCount({
    authorId: $('authorId'),
    category: $('category'),
  }),
]);

export const getComments = query(q => [
  q.comments({ postId: $('postId') }, comment => [
    comment.id,
    comment.text,
    comment.author(author => [author.id, author.username, author.avatar]),
    comment.likes(like => [like.id, like.owner(owner => [owner.id, owner.username])]),
  ]),
]);

export const getComment = query(q => [
  q.comment({ id: $('id') }, comment => [
    comment.id,
    comment.text,
    comment.author(author => [author.id, author.username, author.avatar]),
    comment.post(post => [post.id, post.title]),
  ]),
]);

export const getLikes = query(q => [
  q.likes(
    {
      entity: $('entity'),
      id: $('id'),
    },
    like => [like.id, like.owner(owner => [owner.id, owner.username, owner.avatar])],
  ),
]);

export const getLikeCount = query(q => [
  q.likeCount({
    entity: $('entity'),
    id: $('id'),
  }),
]);

export const hasUserLiked = query(q => [
  q.hasUserLiked({
    entity: $('entity'),
    entityId: $('entityId'),
  }),
]);

export const checkJwt = query(q => [q.checkJwt]);
