import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';
import { OAuthService } from '../src/auth/oauth/oauth.service';
import { JwtKeyService } from '../src/auth/jwt/jwt-key.service';
import { HashService } from '../src/auth/hash/hash.service';
import { User } from '../src/users/entities/user.entity';
import * as crypto from 'crypto';
import { CreateUserInput } from 'users/dto/create-user.input';
import { IsUniqueConstraint } from 'common/is-unique';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { useContainer } from 'class-validator';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLExceptionFilter } from 'common/filters/graphql-exception.filter';
import { SharedJwtModule } from 'common/shared-jwt.module';
import { AuthModule } from 'auth/auth.module';
import { UsersModule } from 'users/users.module';
import { HashModule } from 'auth/hash/hash.module';
import { JwtKeyModule } from 'auth/jwt/jwt-key.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from 'common/common.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { GraphQLFormattedError } from 'graphql';
import util from 'util';

const mockUser: User = {
  id: crypto.randomUUID(),
  username: 'testuser',
  email: 'test@example.com',
  password: 'hashedpassword',
  isOAuthUser: () => false,
  canUsePasswordAuth: () => true,
} as unknown as User;

const mockOAuthUser: User = {
  id: crypto.randomUUID(),
  username: 'oauthuser',
  email: 'oauth@example.com',
  password: null,
  isOAuthUser: () => true,
  canUsePasswordAuth: () => false,
} as unknown as User;

const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

const mockJwtKeyService = {
  getPrivKey: jest.fn().mockResolvedValue(privateKey),
  getPubKey: jest.fn().mockResolvedValue(publicKey),
};

const mockHashService = {
  hashPassword: jest.fn().mockResolvedValue('hashedpassword'),
  comparePassword: jest.fn(),
};

const mockUsersService = {
  findOneByUsername: jest.fn(),
  findOneByEmail: jest.fn(),
  create: jest.fn(),
  getByPayload: jest.fn(),

  findByProviderId: jest.fn(),
  linkOAuthProvider: jest.fn(),
  createOAuthUser: jest.fn(),
};

const mockOAuthService = {
  authenticate: jest.fn(),
  getAuthorizationUrl: jest.fn(),
};

describe('AuthResolver (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;
  let jwtToken: string;

  let gqlRequest: (query: string, variables?: object) => request.Test;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          // envFilePath: '.env.test',
        }),
        AuthModule,
        UsersModule,
        HashModule,
        CommonModule,
        JwtKeyModule,
        SharedJwtModule,

        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: '',
          database: 'postgres',
          synchronize: true,
          dropSchema: true,
          autoLoadEntities: true,
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          sortSchema: true,
          graphiql: true,
          formatError: (
            formattedError: GraphQLFormattedError,
            error: unknown,
          ) => {
            return formattedError;
          },
        }),
      ],
      providers: [
        {
          provide: APP_FILTER,
          useClass: GraphQLExceptionFilter,
        },
      ],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .overrideProvider(OAuthService)
      .useValue(mockOAuthService)
      .overrideProvider(JwtKeyService)
      .useValue(mockJwtKeyService)
      .overrideProvider(HashService)
      .useValue(mockHashService)
      .compile();

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

    useContainer(app.select(AuthModule), { fallbackOnErrors: true });

    await app.init();
    httpServer = app.getHttpServer();

    gqlRequest = (query: string, variables?: object) => {
      return request(httpServer).post('/graphql').send({ query, variables });
    };

    const authService = moduleFixture.get<AuthService>(AuthService);
    const loginData = await authService.login(mockUser);
    jwtToken = loginData.access_token;
  }, 15000);

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    const SIGNUP_MUTATION = `
      mutation Signup($input: CreateUserInput!) {
        signup(createUserInput: $input) {
          id
          username
          email
        }
      }
    `;
    const createUserInput: CreateUserInput = {
      username: 'newuser',
      email: 'new@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    };

    it('should create and return a new user', async () => {
      const newUser = { ...mockUser, ...createUserInput };
      mockUsersService.findOneByUsername.mockResolvedValue(null);
      mockUsersService.findOneByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(newUser);

      const { body } = await gqlRequest(SIGNUP_MUTATION, {
        input: createUserInput,
      }).expect(200);

      expect(body.data.signup).toEqual({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      });
      expect(mockUsersService.create).toHaveBeenCalledWith(
        expect.objectContaining({ username: 'newuser' }),
      );
    });

    it('should return ConflictException if username exists', async () => {
      mockUsersService.findOneByUsername.mockResolvedValue(mockUser);

      const { body } = await gqlRequest(SIGNUP_MUTATION, {
        input: createUserInput,
      }).expect(200);

      expect(body.data).toBeNull();
      expect(body.errors[0].message).toBe('User already exists!');
    });

    it('should return ConflictException if email exists', async () => {
      mockUsersService.findOneByUsername.mockResolvedValue(null);
      mockUsersService.findOneByEmail.mockResolvedValue(mockUser);

      const { body } = await gqlRequest(SIGNUP_MUTATION, {
        input: createUserInput,
      }).expect(200);

      expect(body.data).toBeNull();
      expect(body.errors[0].message).toBe('Email already registered!');
    });

    it('should return validation error if passwords do not match', async () => {
      const { body } = await gqlRequest(SIGNUP_MUTATION, {
        input: { ...createUserInput, confirmPassword: 'wrongpassword' },
      }).expect(200);

      console.log(body);
      expect(body.data).toBeNull();
      expect(body.errors[0].message).toContain(
        'password and confirmPassword does not match!',
      );
    });

    it('should return validation error for short password', async () => {
      const { body } = await gqlRequest(SIGNUP_MUTATION, {
        input: { ...createUserInput, password: '123', confirmPassword: '123' },
      }).expect(200);

      console.log(body);
      expect(body.data).toBeNull();
      expect(body.errors[0].message).toContain(
        'password must be longer than or equal to 8 characters',
      );
    });
  });

  describe('login', () => {
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
    const loginInput = { username: 'testuser', password: 'password123' };

    it('should login and return token and user', async () => {
      mockUsersService.findOneByUsername.mockResolvedValue(mockUser);
      mockHashService.comparePassword.mockResolvedValue(true);

      const { body } = await gqlRequest(LOGIN_MUTATION, {
        input: loginInput,
      }).expect(200);

      expect(body.data.login.access_token).toBeDefined();
      expect(body.data.login.user.id).toEqual(mockUser.id);
      expect(mockHashService.comparePassword).toHaveBeenCalledWith(
        'password123',
        'hashedpassword',
      );
    });

    it('should return NotFoundException if user not found', async () => {
      mockUsersService.findOneByUsername.mockResolvedValue(null);

      const { body } = await gqlRequest(LOGIN_MUTATION, {
        input: loginInput,
      }).expect(200);

      expect(body.data).toBeNull();
      expect(body.errors[0].message).toContain('User testuser not found');
    });

    it('should return BadRequestException for invalid password', async () => {
      mockUsersService.findOneByUsername.mockResolvedValue(mockUser);
      mockHashService.comparePassword.mockResolvedValue(false);

      const { body } = await gqlRequest(LOGIN_MUTATION, {
        input: loginInput,
      }).expect(200);

      expect(body.data).toBeNull();
      expect(body.errors[0].message).toContain('Invalid password!');
    });

    it('should return UnauthorizedException for OAuth user', async () => {
      mockUsersService.findOneByUsername.mockResolvedValue(mockOAuthUser);

      const { body } = await gqlRequest(LOGIN_MUTATION, {
        input: { username: 'oauthuser', password: 'password123' },
      }).expect(200);

      expect(body.data).toBeNull();
      expect(body.errors[0].message).toContain('Please use OAuth to sign in');
    });
  });

  describe('getOAuthUrl', () => {
    const OAUTH_URL_MUTATION = `
      mutation GetOAuthUrl($provider: String!) {
        getOAuthUrl(provider: $provider)
      }
    `;

    it('should return an authorization URL', async () => {
      const googleUrl = 'https://accounts.google.com/o/oauth2/v2/auth?...';
      mockOAuthService.getAuthorizationUrl.mockResolvedValue(googleUrl);

      const { body } = await gqlRequest(OAUTH_URL_MUTATION, {
        provider: 'google',
      }).expect(200);

      expect(body.data.getOAuthUrl).toBe(googleUrl);
      expect(mockOAuthService.getAuthorizationUrl).toHaveBeenCalledWith(
        'google',
      );
    });
  });

  describe('oauthLogin', () => {
    const OAUTH_LOGIN_MUTATION = `
      mutation OAuthLogin($input: OAuthInput!) {
        oauthLogin(oauthInput: $input) {
          access_token
          user {
            id
            username
          }
        }
      }
    `;
    const oauthInput = {
      provider: 'google',
      code: 'test-code-123',
      redirectUri: 'http://localhost:4200/oauth/callback',
    };

    it('should authenticate via OAuth and return token', async () => {
      mockOAuthService.authenticate.mockResolvedValue(mockOAuthUser);

      const { body } = await gqlRequest(OAUTH_LOGIN_MUTATION, {
        input: oauthInput,
      }).expect(200);

      expect(body.data.oauthLogin.access_token).toBeDefined();
      expect(body.data.oauthLogin.user.id).toEqual(mockOAuthUser.id);
      expect(mockOAuthService.authenticate).toHaveBeenCalledWith(oauthInput);
    });

    it('should return error if OAuth authentication fails', async () => {
      mockOAuthService.authenticate.mockRejectedValue(
        new Error('Invalid code'),
      );

      const { body } = await gqlRequest(OAUTH_LOGIN_MUTATION, {
        input: oauthInput,
      }).expect(200);

      util.inspect(body, { depth: null, colors: true });

      expect(body.data).toBeNull();
      expect(body.errors[0].message).toContain('Invalid code');
    });
  });

  describe('Protected Queries', () => {
    describe('whoami', () => {
      const WHOAMI_QUERY = `query { whoami { id username email } }`;

      it('should return the current user', async () => {
        mockUsersService.getByPayload.mockResolvedValue(mockUser);

        const { body } = await gqlRequest(WHOAMI_QUERY)
          .set('Authorization', `Bearer ${jwtToken}`)
          .expect(200);

        console.log(body);

        expect(body.data.whoami).toEqual({
          id: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
        });
        expect(mockUsersService.getByPayload).toHaveBeenCalledWith(
          expect.objectContaining({ sub: mockUser.id }),
        );
      });

      it('should return Unauthorized without a token', async () => {
        const { body } = await gqlRequest(WHOAMI_QUERY).expect(200);

        expect(body.data).toBeNull();
        expect(body.errors[0].message).toBe('Invalid Authorization Header');
      });

      it('should return Unauthorized with an invalid token', async () => {
        const { body } = await gqlRequest(WHOAMI_QUERY)
          .set('Authorization', 'Bearer invalid.token.here')
          .expect(200);

        expect(body.data).toBeNull();
        expect(body.errors[0].message).toBe('Invalid JWT Token provided.');
      });
    });

    describe('checkJwt', () => {
      const CHECKJWT_QUERY = `query { checkJwt }`;

      it('should return true with a valid token', async () => {
        mockUsersService.getByPayload.mockResolvedValue(mockUser);

        const { body } = await gqlRequest(CHECKJWT_QUERY)
          .set('Authorization', `Bearer ${jwtToken}`)
          .expect(200);

        console.log(body);
        expect(body.data.checkJwt).toBe(true);
      });

      it('should return Unauthorized without a token', async () => {
        const { body } = await gqlRequest(CHECKJWT_QUERY).expect(200);

        util.inspect(body, { depth: null, colors: true });
        expect(body.data).toBeNull();
        expect(body.errors[0].message).toBe('Invalid Authorization Header');
      });
    });

    describe('auth', () => {
      const AUTH_QUERY = `query { auth }`;

      it('should return the test string with a valid token', async () => {
        mockUsersService.getByPayload.mockResolvedValue(mockUser);

        const { body } = await gqlRequest(AUTH_QUERY)
          .set('Authorization', `Bearer ${jwtToken}`)
          .expect(200);

        expect(body.data.auth).toBe("God's boy.");
      });
    });
  });
});
