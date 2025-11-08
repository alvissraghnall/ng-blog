import { query } from '@/generated-api';

export const getCurrentUser = query({
  whoami: {
    id: true,
    username: true,
    email: true,
    avatar: true,
    bio: true,
    emailVerified: true,
  },
});

export const getUserByUsername = (username: string) =>
  query({
    user: [
      { username },
      {
        id: true,
        username: true,
        email: true,
        avatar: true,
        bio: true,
        emailVerified: true,
      },
    ],
  });

export const findUserById = (id: string) =>
  query({
    findUserById: [
      { id },
      {
        id: true,
        username: true,
        email: true,
        avatar: true,
        bio: true,
        emailVerified: true,
      },
    ],
  });

export const getPost = (id: number) =>
  query({
    post: [
      { id },
      {
        id: true,
        title: true,
        desc: true,
        content: true,
        image: true,
        category: true,
        likeCount: true,
        commentCount: true,
        author: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    ],
  });

export const getAllPosts = (params?: {
  category?: string;
  authorId?: string;
  limit?: number;
  offset?: number;
}) =>
  query({
    posts: [
      params || {},
      {
        id: true,
        title: true,
        desc: true,
        content: true,
        image: true,
        category: true,
        likeCount: true,
        commentCount: true,
        author: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    ],
  });

export const getRecentPosts = (limit: number = 10) =>
  query({
    recentPosts: [
      { limit },
      {
        id: true,
        title: true,
        desc: true,
        image: true,
        category: true,
        likeCount: true,
        commentCount: true,
        author: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    ],
  });

export const getPopularPosts = (limit: number = 10) =>
  query({
    popularPosts: [
      { limit },
      {
        id: true,
        title: true,
        desc: true,
        image: true,
        category: true,
        likeCount: true,
        commentCount: true,
        author: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    ],
  });

export const getPostsByCategory = (category: string, limit?: number) =>
  query({
    postsByCategory: [
      { category, limit },
      {
        id: true,
        title: true,
        desc: true,
        image: true,
        category: true,
        likeCount: true,
        commentCount: true,
        author: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    ],
  });

export const getPostsByAuthor = (authorId: string, limit?: number) =>
  query({
    postsByAuthor: [
      { authorId, limit },
      {
        id: true,
        title: true,
        desc: true,
        image: true,
        category: true,
        likeCount: true,
        commentCount: true,
        author: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    ],
  });

export const getPostCount = (params?: { authorId?: string; category?: string }) =>
  query({
    postCount: [params || {}, true],
  });

export const getComments = (postId: number) =>
  query({
    comments: [
      { postId },
      {
        id: true,
        text: true,
        author: {
          id: true,
          username: true,
          avatar: true,
        },
        likes: {
          id: true,
          owner: {
            id: true,
            username: true,
          },
        },
      },
    ],
  });

export const getComment = (id: number) =>
  query({
    comment: [
      { id },
      {
        id: true,
        text: true,
        author: {
          id: true,
          username: true,
          avatar: true,
        },
        post: {
          id: true,
          title: true,
        },
      },
    ],
  });

export const getLikes = (entity: string, id: number) =>
  query({
    likes: [
      { entity, id },
      {
        id: true,
        owner: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    ],
  });

export const getLikeCount = (entity: string, id: number) =>
  query({
    likeCount: [{ entity, id }, true],
  });

export const hasUserLiked = (entity: string, entityId: number) =>
  query({
    hasUserLiked: [{ entity, entityId }, true],
  });

export const checkJwt = query({
  checkJwt: true,
});
