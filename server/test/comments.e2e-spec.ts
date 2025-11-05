import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { User } from '../src/users/entities/user.entity';
import { Post } from '../src/posts/entities/post.entity';
import { Comment } from '../src/posts/comments/entities/comment.entity';
import { JwtService } from '@nestjs/jwt';
import { useContainer } from 'class-validator';
import { Category } from 'posts/enum/category.enum';
import { JwtKeyService } from 'auth/jwt/jwt-key.service';
import util from 'util';

describe('CommentsModule (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let jwtService: JwtService;
  let jwtKeyService: JwtKeyService;

  let testUser1: User;
  let testUser2: User;
  let testPost: Post;
  let testComment: Comment;
  let authToken1: string;
  let authToken2: string;

  const graphqlEndpoint = '/graphql';

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
    jwtService = moduleFixture.get<JwtService>(JwtService);
    jwtKeyService = moduleFixture.get<JwtKeyService>(JwtKeyService);

    await dataSource.synchronize(true);

    const userRepo = dataSource.getRepository(User);
    testUser1 = await userRepo.save(
      userRepo.create({
        email: 'user1@test.com',
        username: 'testuser1',
        password: 'hashedpassword1',
      }),
    );
    testUser2 = await userRepo.save(
      userRepo.create({
        email: 'user2@test.com',
        username: 'testuser2',
        password: 'hashedpassword2',
      }),
    );

    const postRepo = dataSource.getRepository(Post);
    testPost = await postRepo.save(
      postRepo.create({
        title: 'Test Post',
        image: 'https://gratatata.io/679854',
        desc: 'description',
        category: Category.FASHION,
        content: 'Test post content',
        author: testUser1,
      }),
    );

    authToken1 = jwtService.sign(
      {
        sub: testUser1.id,
        email: testUser1.email,
        username: testUser1.username,
        isOAuth: false,
      },
      {
        algorithm: 'RS256',
        privateKey: await jwtKeyService.getPrivKey(),
        expiresIn: new Date().setMonth(new Date().getMonth() + 1),
        issuer: 'reblog',
      },
    );
    authToken2 = jwtService.sign(
      {
        sub: testUser2.id,
        email: testUser2.email,
        username: testUser2.username,
        isOAuth: false,
      },
      {
        algorithm: 'RS256',
        privateKey: await jwtKeyService.getPrivKey(),
        expiresIn: new Date().setMonth(new Date().getMonth() + 1),
        issuer: 'reblog',
      },
    );
  }, 15000);

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  describe('createComment', () => {
    it('should create a comment when authenticated', () => {
      const mutation = `
        mutation CreateComment($input: CreateCommentInput!) {
          createComment(createCommentInput: $input) {
            id
            text
            author {
              id
              username
            }
            post {
              id
              title
            }
          }
        }
      `;

      return request(app.getHttpServer())
        .post(graphqlEndpoint)
        .set('Authorization', `Bearer ${authToken1}`)
        .send({
          query: mutation,
          variables: {
            input: {
              text: 'This is a test comment',
              postId: testPost.id,
            },
          },
        })
        .expect(200)
        .expect((res) => {
		  console.log(util.inspect(res.body, { depth: null }));
          expect(res.body.data.createComment).toBeDefined();
          expect(res.body.data.createComment.text).toBe(
            'This is a test comment',
          );
          expect(res.body.data.createComment.author.id).toBe(testUser1.id);
          expect(res.body.data.createComment.post.id).toBe(testPost.id);
          testComment = res.body.data.createComment;
        });
    });

    it('should fail to create comment without authentication', () => {
      const mutation = `
        mutation CreateComment($input: CreateCommentInput!) {
          createComment(createCommentInput: $input) {
            id
            text
          }
        }
      `;

      return request(app.getHttpServer())
        .post(graphqlEndpoint)
        .send({
          query: mutation,
          variables: {
            input: {
              text: 'Unauthorized comment',
              postId: testPost.id,
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
          expect(res.body.errors[0].message).toContain("Invalid Authorization Header");
        });
    });

    it('should fail to create comment with non-existent post', () => {
      const mutation = `
        mutation CreateComment($input: CreateCommentInput!) {
          createComment(createCommentInput: $input) {
            id
            text
          }
        }
      `;

      return request(app.getHttpServer())
        .post(graphqlEndpoint)
        .set('Authorization', `Bearer ${authToken1}`)
        .send({
          query: mutation,
          variables: {
            input: {
              text: 'Comment on non-existent post',
              postId: 99999,
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
          expect(res.body.errors[0].message).toContain('does not exist');
        });
    });

    it('should fail to create comment with empty text', () => {
      const mutation = `
        mutation CreateComment($input: CreateCommentInput!) {
          createComment(createCommentInput: $input) {
            id
            text
          }
        }
      `;

      return request(app.getHttpServer())
        .post(graphqlEndpoint)
        .set('Authorization', `Bearer ${authToken1}`)
        .send({
          query: mutation,
          variables: {
            input: {
              text: '',
              postId: testPost.id,
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });

    it('should fail to create comment without postId', () => {
      const mutation = `
        mutation CreateComment($input: CreateCommentInput!) {
          createComment(createCommentInput: $input) {
            id
            text
          }
        }
      `;

      return request(app.getHttpServer())
        .post(graphqlEndpoint)
        .set('Authorization', `Bearer ${authToken1}`)
        .send({
          query: mutation,
          variables: {
            input: {
              text: 'Comment without post',
            },
          },
        })
        .expect(400);
    });
  });

  describe('getCommentsOnPost', () => {
    beforeAll(async () => {
      // Create additional comments for testing
      const commentRepo = dataSource.getRepository(Comment);
      await commentRepo.save([
        commentRepo.create({
          text: 'Second comment',
          post: testPost,
          author: testUser2,
        }),
        commentRepo.create({
          text: 'Third comment',
          post: testPost,
          author: testUser1,
        }),
      ]);
    });

    it('should retrieve all comments on a post', () => {
      const query = `
        query GetComments($postId: Int!) {
          comments(postId: $postId) {
            id
            text
            author {
              id
              username
            }
            post {
              id
            }
          }
        }
      `;

      return request(app.getHttpServer())
        .post(graphqlEndpoint)
        .send({
          query,
          variables: {
            postId: testPost.id,
          },
        })
        .expect(200)
        .expect((res) => {
		  console.log(util.inspect(res.body, { depth: null }));
          expect(res.body.data.comments).toBeDefined();
          expect(res.body.data.comments).toBeInstanceOf(Array);
          expect(res.body.data.comments.length).toBeGreaterThanOrEqual(3);
          expect(res.body.data.comments[0].post.id).toBe(testPost.id);
        });
    });

    it('should return empty array for post with no comments', async () => {
      const postRepo = dataSource.getRepository(Post);
      const emptyPost = await postRepo.save(
        postRepo.create({
          title: 'Empty Post',
          content: 'No comments here',
          author: testUser1,
        	image: 'https://gratatata.io/679854',
        	desc: 'description',
	        category: Category.FASHION,
        }),
      );

      const query = `
        query GetComments($postId: Int!) {
          comments(postId: $postId) {
            id
            text
          }
        }
      `;

      return request(app.getHttpServer())
        .post(graphqlEndpoint)
        .send({
          query,
          variables: {
            postId: emptyPost.id,
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.comments).toBeDefined();
          expect(res.body.data.comments).toEqual([]);
        });
    });
  });

  describe('findOne', () => {
    it('should retrieve a single comment by id', () => {
      const query = `
        query GetComment($id: Int!) {
          comment(id: $id) {
            id
            text
            author {
              id
              username
            }
          }
        }
      `;

      return request(app.getHttpServer())
        .post(graphqlEndpoint)
        .send({
          query,
          variables: {
            id: testComment.id,
          },
        })
        .expect(200)
        .expect((res) => {
		  console.log(util.inspect(res.body, { depth: null }));
          expect(res.body.data.comment).toBeDefined();
          expect(res.body.data.comment.id).toBe(testComment.id);
          expect(res.body.data.comment.text).toBe(testComment.text);
        });
    });

    it('should return null for non-existent comment', () => {
      const query = `
        query GetComment($id: Int!) {
          comment(id: $id) {
            id
            text
          }
        }
      `;

      return request(app.getHttpServer())
        .post(graphqlEndpoint)
        .send({
          query,
          variables: {
            id: 99999,
          },
        })
        .expect(200)
        .expect((res) => {
		  console.log(util.inspect(res.body, { depth: null }));

          expect(res.body.data.comment).toBeNull();
        });
    });
  });

  describe('updateComment', () => {
    it('should update comment when user is the author', () => {
      const mutation = `
        mutation UpdateComment($input: UpdateCommentInput!) {
          updateComment(updateCommentInput: $input) {
            id
            text
            author {
              id
            }
          }
        }
      `;

      return request(app.getHttpServer())
        .post(graphqlEndpoint)
        .set('Authorization', `Bearer ${authToken1}`)
        .send({
          query: mutation,
          variables: {
            input: {
              id: testComment.id,
              text: 'Updated comment text',
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.updateComment).toBeDefined();
          expect(res.body.data.updateComment.text).toBe('Updated comment text');
          expect(res.body.data.updateComment.id).toBe(testComment.id);
        });
    });

    it('should fail to update comment when user is not the author', async () => {
      const commentRepo = dataSource.getRepository(Comment);
      const user1Comment = await commentRepo.save(
        commentRepo.create({
          text: 'User 1 comment',
          post: testPost,
          author: testUser1,
        }),
      );

      const mutation = `
        mutation UpdateComment($input: UpdateCommentInput!) {
          updateComment(updateCommentInput: $input) {
            id
            text
          }
        }
      `;

      return request(app.getHttpServer())
        .post(graphqlEndpoint)
        .set('Authorization', `Bearer ${authToken2}`)
        .send({
          query: mutation,
          variables: {
            input: {
              id: user1Comment.id,
              text: 'Trying to update someone elses comment',
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
          expect(res.body.errors[0].message).toContain('permission');
        });
    });

    it('should fail to update comment without authentication', () => {
      const mutation = `
        mutation UpdateComment($input: UpdateCommentInput!) {
          updateComment(updateCommentInput: $input) {
            id
            text
          }
        }
      `;

      return request(app.getHttpServer())
        .post(graphqlEndpoint)
        .send({
          query: mutation,
          variables: {
            input: {
              id: testComment.id,
              text: 'Unauthorized update',
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
          expect(res.body.errors[0].message).toContain("Invalid Authorization Header");
        });
    });

    it('should fail to update non-existent comment', () => {
      const mutation = `
        mutation UpdateComment($input: UpdateCommentInput!) {
          updateComment(updateCommentInput: $input) {
            id
            text
          }
        }
      `;

      return request(app.getHttpServer())
        .post(graphqlEndpoint)
        .set('Authorization', `Bearer ${authToken1}`)
        .send({
          query: mutation,
          variables: {
            input: {
              id: 99999,
              text: 'Update non-existent',
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
          expect(res.body.errors[0].message).toContain('not found');
        });
    });

    it('should fail to update comment with empty text', () => {
      const mutation = `
        mutation UpdateComment($input: UpdateCommentInput!) {
          updateComment(updateCommentInput: $input) {
            id
            text
          }
        }
      `;

      return request(app.getHttpServer())
        .post(graphqlEndpoint)
        .set('Authorization', `Bearer ${authToken1}`)
        .send({
          query: mutation,
          variables: {
            input: {
              id: testComment.id,
              text: '',
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });
  });

  describe('removeComment', () => {
    let commentToDelete: Comment;

    beforeEach(async () => {
      const commentRepo = dataSource.getRepository(Comment);
      commentToDelete = await commentRepo.save(
        commentRepo.create({
          text: 'Comment to be deleted',
          post: testPost,
          author: testUser1,
        }),
      );
    });

    it('should delete comment when user is the author', async () => {
      const mutation = `
        mutation RemoveComment($id: Int!) {
          removeComment(id: $id) {
            id
            text
          }
        }
      `;

      await request(app.getHttpServer())
        .post(graphqlEndpoint)
        .set('Authorization', `Bearer ${authToken1}`)
        .send({
          query: mutation,
          variables: {
            id: commentToDelete.id,
          },
        })
        .expect(200)
        .expect((res) => {
		  console.log(util.inspect(res.body, { depth: null }));

          expect(res.body.data.removeComment).toBeDefined();
          expect(res.body.data.removeComment.id).toBe(commentToDelete.id);
        });

      const commentRepo = dataSource.getRepository(Comment);
      const deletedComment = await commentRepo.findOneBy({
        id: commentToDelete.id,
      });
      expect(deletedComment).toBeNull();
    });

    it('should fail to delete comment when user is not the author', async () => {
      const mutation = `
        mutation RemoveComment($id: Int!) {
          removeComment(id: $id) {
            id
          }
        }
      `;

      return request(app.getHttpServer())
        .post(graphqlEndpoint)
        .set('Authorization', `Bearer ${authToken2}`)
        .send({
          query: mutation,
          variables: {
            id: commentToDelete.id,
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
          expect(res.body.errors[0].message).toContain('permission');
        });
    });

    it('should fail to delete comment without authentication', () => {
      const mutation = `
        mutation RemoveComment($id: Int!) {
          removeComment(id: $id) {
            id
          }
        }
      `;

      return request(app.getHttpServer())
        .post(graphqlEndpoint)
        .send({
          query: mutation,
          variables: {
            id: commentToDelete.id,
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
          expect(res.body.errors[0].message).toContain("Invalid Authorization Header");
        });
    });

    it('should fail to delete non-existent comment', () => {
      const mutation = `
        mutation RemoveComment($id: Int!) {
          removeComment(id: $id) {
            id
          }
        }
      `;

      return request(app.getHttpServer())
        .post(graphqlEndpoint)
        .set('Authorization', `Bearer ${authToken1}`)
        .send({
          query: mutation,
          variables: {
            id: 99999,
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
          expect(res.body.errors[0].message).toContain('not found');
        });
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete comment lifecycle', async () => {
      const createMutation = `
        mutation CreateComment($input: CreateCommentInput!) {
          createComment(createCommentInput: $input) {
            id
            text
          }
        }
      `;

      const createRes = await request(app.getHttpServer())
        .post(graphqlEndpoint)
        .set('Authorization', `Bearer ${authToken1}`)
        .send({
          query: createMutation,
          variables: {
            input: {
              text: 'Lifecycle test comment',
              postId: testPost.id,
            },
          },
        })
        .expect(200);

      const newCommentId = createRes.body.data.createComment.id;

      const readQuery = `
        query GetComment($id: Int!) {
          comment(id: $id) {
            id
            text
          }
        }
      `;

      await request(app.getHttpServer())
        .post(graphqlEndpoint)
        .send({
          query: readQuery,
          variables: { id: newCommentId },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.comment.text).toBe('Lifecycle test comment');
        });

      const updateMutation = `
        mutation UpdateComment($input: UpdateCommentInput!) {
          updateComment(updateCommentInput: $input) {
            id
            text
          }
        }
      `;

      await request(app.getHttpServer())
        .post(graphqlEndpoint)
        .set('Authorization', `Bearer ${authToken1}`)
        .send({
          query: updateMutation,
          variables: {
            input: {
              id: newCommentId,
              text: 'Updated lifecycle comment',
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.updateComment.text).toBe(
            'Updated lifecycle comment',
          );
        });

      const deleteMutation = `
        mutation RemoveComment($id: Int!) {
          removeComment(id: $id) {
            id
          }
        }
      `;

      await request(app.getHttpServer())
        .post(graphqlEndpoint)
        .set('Authorization', `Bearer ${authToken1}`)
        .send({
          query: deleteMutation,
          variables: { id: newCommentId },
        })
        .expect(200);

      await request(app.getHttpServer())
        .post(graphqlEndpoint)
        .send({
          query: readQuery,
          variables: { id: newCommentId },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.comment).toBeNull();
        });
    });

    it('should handle multiple comments by different users on same post', async () => {
      const createMutation = `
        mutation CreateComment($input: CreateCommentInput!) {
          createComment(createCommentInput: $input) {
            id
            text
            author {
              id
              username
            }
          }
        }
      `;

      await request(app.getHttpServer())
        .post(graphqlEndpoint)
        .set('Authorization', `Bearer ${authToken1}`)
        .send({
          query: createMutation,
          variables: {
            input: {
              text: 'User 1 multi-user test',
              postId: testPost.id,
            },
          },
        })
        .expect(200);

      await request(app.getHttpServer())
        .post(graphqlEndpoint)
        .set('Authorization', `Bearer ${authToken2}`)
        .send({
          query: createMutation,
          variables: {
            input: {
              text: 'User 2 multi-user test',
              postId: testPost.id,
            },
          },
        })
        .expect(200);

      const getCommentsQuery = `
        query GetComments($postId: Int!) {
          comments(postId: $postId) {
            id
            text
            author {
              username
            }
          }
        }
      `;

      return request(app.getHttpServer())
        .post(graphqlEndpoint)
        .send({
          query: getCommentsQuery,
          variables: { postId: testPost.id },
        })
        .expect(200)
        .expect((res) => {
          const comments = res.body.data.comments;
          const user1Comments = comments.filter(
            (c: Comment) => c.author.username === 'testuser1',
          );
          const user2Comments = comments.filter(
            (c: Comment) => c.author.username === 'testuser2',
          );
          expect(user1Comments.length).toBeGreaterThan(0);
          expect(user2Comments.length).toBeGreaterThan(0);
        });
    });
  });
});
