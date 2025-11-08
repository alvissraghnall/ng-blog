import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { User } from 'users/entities/user.entity';
import { Post } from 'posts/entities/post.entity';
import { Comment } from 'posts/comments/entities/comment.entity';
import { Like } from 'posts/likes/entities/like.entity';
import { useContainer } from 'class-validator';
import { Category } from 'posts/enum/category.enum';

describe('Likes (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let authToken: string;
  let secondUserToken: string;
  let testUser: User;
  let secondUser: User;
  let testPost: Post;
  let testComment: Comment;

  const gqlRequest = (query: string, token?: string, variables?: object) => {
    const req = request(app.getHttpServer())
      .post('/graphql')
      .send({ query, variables });

    if (token) {
      req.set('Authorization', `Bearer ${token}`);
    }

    return req;
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        forbidUnknownValues: true,
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        exceptionFactory: (errors) => {
          const detailed = errors.map((error) => ({
            property: error.property,
            constraints: error.constraints,
            children: error.children,
          }));

          const messages = errors.flatMap((e) =>
            Object.values(e.constraints || {}),
          );

          // If there are any constraint messages, prefer ~~
          if (messages.length > 0) {
            return new BadRequestException(messages.join(', '));
          }

          // Otherwise fall back to detailed structure (like nested validation)
          return new BadRequestException({
            message: 'Validation failed',
            errors: detailed,
          });
        },
      }),
    );

    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  beforeEach(async () => {
    await dataSource.query('DELETE FROM "like"');
    await dataSource.query('DELETE FROM "comment"');
    await dataSource.query('DELETE FROM "post"');
    await dataSource.query('DELETE FROM "user"');

    const userRepo = dataSource.getRepository(User);
    testUser = await userRepo.save(
      userRepo.create({
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashedpassword',
      }),
    );

    secondUser = await userRepo.save(
      userRepo.create({
        email: 'second@example.com',
        username: 'seconduser',
        password: 'hashedpassword',
      }),
    );

    const LOGIN_MUTATION = `
      mutation Login($input: LoginUserInput!) {
        login(loginUserInput: $input) {
          access_token
          user {
            id
            username
          }
        }
      }
    `;

    // const loginMutation = `
    //   mutation {
    //     login(loginUserInput: { email: "test@example.com", password: "password123" }) {
    //       access_token
    //     }
    //   }
    // `;
    const loginMutationResponse = await gqlRequest(LOGIN_MUTATION, '', {
      input: {
        username: 'testuser',
        password: 'hashedpassword',
      },
    });

    const secondLoginMutationResponse = await gqlRequest(LOGIN_MUTATION, '', {
      input: {
        username: 'seconduser',
        password: 'hashedpassword',
      },
    });

    //console.log(loginMutationResponse.body);
    authToken = loginMutationResponse.body.data.login.access_token;
    secondUserToken = secondLoginMutationResponse.body.data.login.access_token;

    const postRepo = dataSource.getRepository(Post);
    testPost = await postRepo.save(
      postRepo.create({
        title: 'Test Post',
        image: 'https://gratatata.io/679854',
        desc: 'description',
        category: Category.FASHION,
        content: 'Test content',
        author: testUser,
      }),
    );

    const commentRepo = dataSource.getRepository(Comment);
    testComment = await commentRepo.save(
      commentRepo.create({
        text: 'Test comment',
        author: testUser,
        post: testPost,
      }),
    );
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  describe('toggleLike mutation', () => {
    it('should create a like on a post', async () => {
      const mutation = `
        mutation {
          toggleLike(createLikeInput: { postId: ${testPost.id} }) {
            id
            post {
              id
              title
            }
            owner {
              id
              username
            }
          }
        }
      `;

      const response = await gqlRequest(mutation, authToken);
      console.log(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.toggleLike).toMatchObject({
        post: {
          id: testPost.id,
          title: testPost.title,
        },
        owner: {
          id: testUser.id,
          username: testUser.username,
        },
      });
      expect(response.body.data.toggleLike.id).toBeDefined();
    });

    it('should create a like on a comment', async () => {
      const mutation = `
        mutation {
          toggleLike(createLikeInput: { commentId: ${testComment.id} }) {
            id
            comment {
              id
              text
            }
            owner {
              id
              username
            }
          }
        }
      `;

      const response = await gqlRequest(mutation, authToken);
      console.log(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.toggleLike).toMatchObject({
        comment: {
          id: testComment.id,
          text: testComment.text,
        },
        owner: {
          id: testUser.id,
          username: testUser.username,
        },
      });
    });

    it('should remove like when toggling an already liked post', async () => {
      const likeRepo = dataSource.getRepository(Like);
      const existingLike = await likeRepo.save(
        likeRepo.create({
          post: testPost,
          owner: testUser,
        }),
      );

      const mutation = `
        mutation {
          toggleLike(createLikeInput: { postId: ${testPost.id} }) {
            id
          }
        }
      `;

      const response = await gqlRequest(mutation, authToken);

      console.log(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.toggleLike.id).toBe(existingLike.id);

      const remainingLike = await likeRepo.findOne({
        where: { id: existingLike.id },
      });
      expect(remainingLike).toBeNull();
    });

    it('should remove like when toggling an already liked comment', async () => {
      const likeRepo = dataSource.getRepository(Like);
      const existingLike = await likeRepo.save(
        likeRepo.create({
          comment: testComment,
          owner: testUser,
        }),
      );

      const mutation = `
        mutation {
          toggleLike(createLikeInput: { commentId: ${testComment.id} }) {
            id
          }
        }
      `;

      const response = await gqlRequest(mutation, authToken);
      console.log(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.toggleLike.id).toBe(existingLike.id);

      // Verify like was removed
      const remainingLike = await likeRepo.findOne({
        where: { id: existingLike.id },
      });
      expect(remainingLike).toBeNull();
    });

    it('should fail when both postId and commentId are provided', async () => {
      const mutation = `
        mutation {
          toggleLike(createLikeInput: { postId: ${testPost.id}, commentId: ${testComment.id} }) {
            id
          }
        }
      `;

      const response = await gqlRequest(mutation, authToken);

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toContain(
        'Must provide either commentId or postId, not both or neither',
      );
    });

    it('should fail when neither postId nor commentId are provided', async () => {
      const mutation = `
        mutation {
          toggleLike(createLikeInput: {}) {
            id
          }
        }
      `;

      const response = await gqlRequest(mutation, authToken);

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toContain(
        'Must provide either commentId or postId, not both or neither',
      );
    });

    it('should fail when post does not exist', async () => {
      const mutation = `
        mutation {
          toggleLike(createLikeInput: { postId: 99999 }) {
            id
          }
        }
      `;

      const response = await gqlRequest(mutation, authToken);

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toContain(
        'Post with id 99999 not found',
      );
    });

    it('should fail when comment does not exist', async () => {
      const mutation = `
        mutation {
          toggleLike(createLikeInput: { commentId: 99999 }) {
            id
          }
        }
      `;

      const response = await gqlRequest(mutation, authToken);

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toContain(
        'Comment with id 99999 not found',
      );
    });

    it('should fail when user is not authenticated', async () => {
      const mutation = `
        mutation {
          toggleLike(createLikeInput: { postId: ${testPost.id} }) {
            id
          }
        }
      `;

      const response = await gqlRequest(mutation);

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toContain(
        'Invalid Authorization Header',
      );
    });

    it('should allow multiple users to like the same post', async () => {
      // First user likes
      const mutation1 = `
        mutation {
          toggleLike(createLikeInput: { postId: ${testPost.id} }) {
            id
          }
        }
      `;
      await gqlRequest(mutation1, authToken);

      // Second user likes
      const mutation2 = `
        mutation {
          toggleLike(createLikeInput: { postId: ${testPost.id} }) {
            id
          }
        }
      `;
      const response = await gqlRequest(mutation2, secondUserToken);

      expect(response.status).toBe(200);
      expect(response.body.data.toggleLike).toBeDefined();

      // Verify both likes exist
      const likeRepo = dataSource.getRepository(Like);
      const likes = await likeRepo.find({
        where: { post: { id: testPost.id } },
      });
      expect(likes).toHaveLength(2);
    });
  });

  describe('likes query', () => {
    beforeEach(async () => {
      // Create multiple likes
      const likeRepo = dataSource.getRepository(Like);
      await likeRepo.save([
        likeRepo.create({ post: testPost, owner: testUser }),
        likeRepo.create({ post: testPost, owner: secondUser }),
      ]);
    });

    it('should return all likes for a post', async () => {
      const query = `
        query {
          likes(id: ${testPost.id}, entity: POST) {
            id
            owner {
              id
              username
            }
            post {
              id
            }
          }
        }
      `;

      const response = await gqlRequest(query);

      expect(response.status).toBe(200);
      expect(response.body.data.likes).toHaveLength(2);
      expect(response.body.data.likes[0].post.id).toBe(testPost.id);
    });

    it('should return all likes for a comment', async () => {
      const likeRepo = dataSource.getRepository(Like);
      await likeRepo.save([
        likeRepo.create({ comment: testComment, owner: testUser }),
      ]);

      const query = `
        query {
          likes(id: ${testComment.id}, entity: COMMENT) {
            id
            owner {
              id
              username
            }
            comment {
              id
            }
          }
        }
      `;

      const response = await gqlRequest(query);

      expect(response.status).toBe(200);
      expect(response.body.data.likes).toHaveLength(1);
      expect(response.body.data.likes[0].comment.id).toBe(testComment.id);
    });

    it('should return empty array when no likes exist', async () => {
      await dataSource.query('DELETE FROM "like"');

      const query = `
        query {
          likes(id: ${testPost.id}, entity: POST) {
            id
          }
        }
      `;

      const response = await gqlRequest(query);

      expect(response.status).toBe(200);
      expect(response.body.data.likes).toEqual([]);
    });

    it('should be accessible without authentication (public)', async () => {
      const query = `
        query {
          likes(id: ${testPost.id}, entity: POST) {
            id
          }
        }
      `;

      const response = await gqlRequest(query);

      expect(response.status).toBe(200);
      expect(response.body.data.likes).toBeDefined();
    });
  });

  describe('likeCount query', () => {
    it('should return correct count for post likes', async () => {
      const likeRepo = dataSource.getRepository(Like);
      await likeRepo.save([
        likeRepo.create({ post: testPost, owner: testUser }),
        likeRepo.create({ post: testPost, owner: secondUser }),
      ]);

      const query = `
        query {
          likeCount(id: ${testPost.id}, entity: POST)
        }
      `;

      const response = await gqlRequest(query);

      expect(response.status).toBe(200);
      expect(response.body.data.likeCount).toBe(2);
    });

    it('should return correct count for comment likes', async () => {
      const likeRepo = dataSource.getRepository(Like);
      await likeRepo.save([
        likeRepo.create({ comment: testComment, owner: testUser }),
      ]);

      const query = `
        query {
          likeCount(id: ${testComment.id}, entity: COMMENT)
        }
      `;

      const response = await gqlRequest(query);

      expect(response.status).toBe(200);
      expect(response.body.data.likeCount).toBe(1);
    });

    it('should return 0 when no likes exist', async () => {
      const query = `
        query {
          likeCount(id: ${testPost.id}, entity: POST)
        }
      `;

      const response = await gqlRequest(query);

      expect(response.status).toBe(200);
      expect(response.body.data.likeCount).toBe(0);
    });

    it('should be accessible without authentication (public)', async () => {
      const query = `
        query {
          likeCount(id: ${testPost.id}, entity: POST)
        }
      `;

      const response = await gqlRequest(query);

      expect(response.status).toBe(200);
      expect(response.body.data.likeCount).toBeDefined();
    });
  });

  describe('hasUserLiked query', () => {
    beforeEach(async () => {
      const likeRepo = dataSource.getRepository(Like);
      await likeRepo.save(likeRepo.create({ post: testPost, owner: testUser }));
    });

    it('should return true when user has liked a post', async () => {
      const query = `
        query {
          hasUserLiked(entityId: ${testPost.id}, entity: POST)
        }
      `;

      const response = await gqlRequest(query, authToken);

      expect(response.status).toBe(200);
      expect(response.body.data.hasUserLiked).toBe(true);
    });

    it('should return false when user has not liked a post', async () => {
      const query = `
        query {
          hasUserLiked(entityId: ${testPost.id}, entity: POST)
        }
      `;

      const response = await gqlRequest(query, secondUserToken);

      expect(response.status).toBe(200);
      expect(response.body.data.hasUserLiked).toBe(false);
    });

    it('should return true when user has liked a comment', async () => {
      const likeRepo = dataSource.getRepository(Like);
      await likeRepo.save(
        likeRepo.create({ comment: testComment, owner: testUser }),
      );

      const query = `
        query {
          hasUserLiked(entityId: ${testComment.id}, entity: COMMENT)
        }
      `;

      const response = await gqlRequest(query, authToken);

      expect(response.status).toBe(200);
      expect(response.body.data.hasUserLiked).toBe(true);
    });

    it('should require authentication', async () => {
      const query = `
        query {
          hasUserLiked(entityId: ${testPost.id}, entity: POST)
        }
      `;

      const response = await gqlRequest(query);

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toContain(
        'Invalid Authorization Header',
      );
    });
  });

  describe('like query (single)', () => {
    let testLike: Like;

    beforeEach(async () => {
      const likeRepo = dataSource.getRepository(Like);
      testLike = await likeRepo.save(
        likeRepo.create({ post: testPost, owner: testUser }),
      );
    });

    it('should return a single like by id', async () => {
      const query = `
        query {
          like(id: ${testLike.id}) {
            id
            post {
              id
              title
              author {
                id
                username
              }
            }
            owner {
              id
              username
            }
          }
        }
      `;

      const response = await gqlRequest(query, authToken);

      expect(response.status).toBe(200);
      expect(response.body.data.like).toMatchObject({
        id: testLike.id,
        post: {
          id: testPost.id,
          title: testPost.title,
        },
        owner: {
          id: testUser.id,
          username: testUser.username,
        },
      });
    });

    it('should fail when like does not exist', async () => {
      const query = `
        query {
          like(id: 99999) {
            id
          }
        }
      `;

      const response = await gqlRequest(query, authToken);

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toContain(
        'Like with id 99999 not found',
      );
    });
  });

  describe('removeLike mutation', () => {
    let testLike: Like;

    beforeEach(async () => {
      const likeRepo = dataSource.getRepository(Like);
      testLike = await likeRepo.save(
        likeRepo.create({ post: testPost, owner: testUser }),
      );
    });

    it('should remove a like when user is the owner', async () => {
      const mutation = `
        mutation {
          removeLike(id: ${testLike.id}) {
            id
            post {
              id
            }
          }
        }
      `;

      const response = await gqlRequest(mutation, authToken);

      expect(response.status).toBe(200);
      expect(response.body.data.removeLike.id).toBe(testLike.id);

      // Verify like was removed
      const likeRepo = dataSource.getRepository(Like);
      const removedLike = await likeRepo.findOne({
        where: { id: testLike.id },
      });
      expect(removedLike).toBeNull();
    });

    it('should fail when user is not the owner (EntityOwnerGuard)', async () => {
      const mutation = `
        mutation {
          removeLike(id: ${testLike.id}) {
            id
          }
        }
      `;

      const response = await gqlRequest(mutation, secondUserToken);

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toContain(
        'You do not have permission to modify this Like',
      );

      // Verify like still exists
      const likeRepo = dataSource.getRepository(Like);
      const existingLike = await likeRepo.findOne({
        where: { id: testLike.id },
      });
      expect(existingLike).toBeDefined();
    });

    it('should fail when like does not exist', async () => {
      const mutation = `
        mutation {
          removeLike(id: 99999) {
            id
          }
        }
      `;

      const response = await gqlRequest(mutation, authToken);

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toContain(
        'Like with id = 99999 not found',
      );
    });

    it('should fail when user is not authenticated', async () => {
      const mutation = `
        mutation {
          removeLike(id: ${testLike.id}) {
            id
          }
        }
      `;

      const response = await gqlRequest(mutation);

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toContain(
        'Invalid Authorization Header',
      );
    });
  });

  describe('Database constraints', () => {
    it('should enforce unique constraint on owner + post', async () => {
      const likeRepo = dataSource.getRepository(Like);

      await likeRepo.save(likeRepo.create({ post: testPost, owner: testUser }));

      // Attempt to create duplicate
      await expect(
        likeRepo.save(likeRepo.create({ post: testPost, owner: testUser })),
      ).rejects.toThrow();
    });

    it('should enforce unique constraint on owner + comment', async () => {
      const likeRepo = dataSource.getRepository(Like);

      await likeRepo.save(
        likeRepo.create({ comment: testComment, owner: testUser }),
      );

      // Attempt to create duplicate
      await expect(
        likeRepo.save(
          likeRepo.create({ comment: testComment, owner: testUser }),
        ),
      ).rejects.toThrow();
    });

    it('should allow same user to like different posts', async () => {
      const postRepo = dataSource.getRepository(Post);
      const secondPost = await postRepo.save(
        postRepo.create({
          title: 'Second Post',
          image: 'https://gratatata.io/679854',
          desc: 'description',
          category: Category.FASHION,
          content: 'Content',
          author: testUser,
        }),
      );

      const likeRepo = dataSource.getRepository(Like);
      await likeRepo.save([
        likeRepo.create({ post: testPost, owner: testUser }),
        likeRepo.create({ post: secondPost, owner: testUser }),
      ]);

      const likes = await likeRepo.find({
        where: { owner: { id: testUser.id } },
      });
      expect(likes).toHaveLength(2);
    });
  });
});
