import { Post } from '@gen';

export const postFields = (post: Post) => [
  post.id,
  post.slug,
  post.title,
  post.desc,
  post.content,
  post.image,
  post.category,
  post.likeCount,
  post.commentCount,
  post.createdAt,
  post.updatedAt,
  post.author(author => [author.id, author.username, author.avatar, author.bio]),
  post.tags(tag => [tag.id, tag.name]),
];
