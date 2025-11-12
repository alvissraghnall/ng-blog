import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtKeyModule } from 'auth/jwt/jwt-key.module';
import { JwtKeyService } from 'auth/jwt/jwt-key.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule, JwtKeyModule],
      inject: [JwtKeyService, ConfigService],
      useFactory: async (
        keyService: JwtKeyService,
        configService: ConfigService,
      ) => ({
        privateKey: await keyService.getPrivKey(),
        publicKey: await keyService.getPubKey(),
        signOptions: {
          expiresIn: '30d',
          algorithm: 'RS256',
          issuer: configService.get<string>('JWT_ISSUER') || 'reblog',
        },
        verifyOptions: { algorithms: ['RS256'] },
      }),
    }),
  ],
  exports: [JwtModule],
})
export class SharedJwtModule {}
