import { $, mutation } from '@gen';
import { postFields } from './shared';

export const signup = mutation(m => [
  m.signup({ createUserInput: $('createUserInput') }, user => [
    user.id,
    user.username,
    user.email,
    user.avatar,
    user.emailVerified,
  ]),
]);

export const login = mutation(m => [
  m.login({ loginUserInput: $('loginUserInput') }, response => [
    response.access_token,
    response.user(user => [
      user.id,
      user.username,
      user.email,
      user.avatar,
      user.bio,
      user.emailVerified,
      user.createdAt,
      user.updatedAt,
    ]),
  ]),
]);

export const oauthLogin = mutation(m => [
  m.oauthLogin({ oauthInput: $('oauthInput') }, response => [
    response.access_token,
    response.user(user => [
      user.id,
      user.username,
      user.email,
      user.avatar,
      user.bio,
      user.emailVerified,
      user.createdAt,
      user.updatedAt,
      user.oauthId,
      user.oauthProvider,
    ]),
  ]),
]);

export const getOAuthUrl = mutation(m => [m.getOAuthUrl({ provider: $('provider') })]);

export const updateUser = mutation(m => [
  m.updateUser({ updateUserInput: $('updateUserInput') }, user => [
    user.id,
    user.username,
    user.email,
    user.avatar,
    user.bio,
    user.emailVerified,
    user.createdAt,
    user.updatedAt,
  ]),
]);

export const removeUser = mutation(m => [m.removeUser({ id: $('id') }, user => [user.id, user.username])]);

export const followUser = mutation(m => [
  m.followUser({ userToBeFollowedId: $('userToBeFollowedId') }, user => [user.id, user.username, user.avatar]),
]);

export const unfollowUser = mutation(m => [
  m.unFollowUser({ userToBeUnfollowedId: $('userToBeUnfollowedId') }, user => [user.id, user.username, user.avatar]),
]);

export const createPost = mutation(m => [
  m.createPost({ createPostInput: $('createPostInput') }, post => [
    post.id,
    post.title,
    post.desc,
    post.content,
    post.image,
    post.category,
    post.author(author => [author.id, author.username, author.avatar]),
    post.createdAt,
    post.likeCount,
    post.commentCount,
    post.slug,
    post.tags(tag => [tag.name]),
  ]),
]);

export const updatePost = mutation(m => [
  m.updatePost({ updatePostInput: $('updatePostInput') }, post => postFields(post)),
]);

export const removePost = mutation(m => [m.removePost({ id: $('id') }, post => [post.id, post.title])]);

export const createComment = mutation(m => [
  m.createComment({ createCommentInput: $('createCommentInput') }, comment => [
    comment.id,
    comment.text,
    comment.author(author => [author.id, author.username, author.avatar]),
    comment.createdAt,
    comment.likeCount,
  ]),
]);

export const updateComment = mutation(m => [
  m.updateComment({ updateCommentInput: $('updateCommentInput') }, comment => [
    comment.id,
    comment.text,
    comment.createdAt,
    comment.likeCount,
  ]),
]);

export const removeComment = mutation(m => [m.removeComment({ id: $('id') }, comment => [comment.id])]);

export const toggleLike = mutation(m => [
  m.toggleLike({ createLikeInput: $('createLikeInput') }, like => [
    like.id,
    like.owner(owner => [owner.id, owner.username]),
  ]),
]);

export const removeLike = mutation(m => [m.removeLike({ id: $('id') }, like => [like.id])]);

export const markNotificationAsRead = mutation(m => [
  m.markNotificationAsRead({ id: $('id') }, notif => [
    notif.message,
    notif.resourceId,
    notif.read,
    notif.actor(actor => [actor.avatar, actor.username]),
  ]),
]);

export const markAllNotificationsAsRead = mutation(m => [m.markAllNotificationsAsRead]);

export const trackPostView = mutation(m => [m.trackPostView({ slug: $('slug') })]);

export const uploadFile = mutation(q => [
  q.uploadFile(
    {
      file: $('file'),
      type: $('type'),
    },
    res => [res.url, res.filename, res.size, res.mimeType],
  ),
]);
