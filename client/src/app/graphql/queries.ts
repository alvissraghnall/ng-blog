import { $, Post, query } from '@gen';
import { postFields } from './shared';

export const getCurrentUser = query(q => [
  q.whoami(user => [
    user.id,
    user.username,
    user.email,
    user.avatar,
    user.bio,
    user.emailVerified,
    user.createdAt,
    user.oauthId,
    user.oauthProvider,
    user.updatedAt,
  ]),
]);

export const getProfile = query(q => [
  q.user({ username: $('username') }, user => [
    user.id,
    user.username,
    user.email,
    user.avatar,
    user.bio,
    user.emailVerified,
    user.followerCount,
    user.followingCount,
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
  q.post(
    {
      id: $('id'),
      slug: $('slug'),
    },
    post => postFields(post),
  ),
]);

export const getTags = query(q => [q.tags(tag => [tag.id, tag.name])]);

export const getAllPosts = query(q => [
  q.posts(
    {
      category: $('category'),
      authorId: $('authorId'),
      limit: $('limit'),
      offset: $('offset'),
    },
    post => postFields(post),
  ),
]);

export const getRecentPosts = query(q => [q.recentPosts({ limit: $('limit') }, post => postFields(post))]);

export const getPopularPosts = query(q => [q.popularPosts({ limit: $('limit') }, post => postFields(post))]);

export const getPostsByCategory = query(q => [
  q.postsByCategory(
    {
      category: $('category'),
      limit: $('limit'),
    },
    post => postFields(post),
  ),
]);

export const getPostsByAuthor = query(q => [
  q.postsByAuthor(
    {
      authorId: $('authorId'),
      limit: $('limit'),
    },
    post => postFields(post),
  ),
]);

export const getPostCount = query(q => [
  q.postCount({
    authorId: $('authorId'),
    category: $('category'),
  }),
]);

export const getComments = query(q => [
  q.comments(
    {
      postId: $('postId'),
      limit: $('limit'),
      offset: $('offset'),
    },
    comment => [
      comment.id,
      comment.text,
      comment.createdAt,
      comment.author(author => [author.id, author.username, author.avatar]),
      comment.likeCount,
    ],
  ),
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

export const getFollowers = query(q => [
  q.followers(
    {
      username: $('username'),
      limit: $('limit'),
      offset: $('offset'),
    },
    user => [user.username, user.avatar, user.isFollowing],
  ),
]);

export const getFollowing = query(q => [
  q.following(
    {
      username: $('username'),
      limit: $('limit'),
      offset: $('offset'),
    },
    user => [user.username, user.avatar, user.isFollowing],
  ),
]);

export const getUnreadNotificationsCount = query(q => [q.unreadNotificationsCount]);

export const getNotifications = query(q => [
  q.notifications(
    {
      limit: $('limit'),
      offset: $('offset'),
    },
    notif => [notif.actor(actor => [actor.avatar, actor.username]), notif.message, notif.createdAt, notif.read],
  ),
]);
