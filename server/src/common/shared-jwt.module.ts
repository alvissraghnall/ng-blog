import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtKeyModule } from 'auth/jwt/jwt-key.module';
import { JwtKeyService } from 'auth/jwt/jwt-key.service';

@Module({
  imports: [
    JwtKeyModule,
    JwtModule.registerAsync({
      imports: [JwtKeyModule],
      useFactory: async (keyService: JwtKeyService) => {
        return {
          privateKey: await keyService.getPrivKey(),
          publicKey: await keyService.getPubKey(),
          signOptions: {
            expiresIn: '30d',
            algorithm: 'RS256',
            issuer: 'reblog',
          },
          verifyOptions: { algorithms: ['RS256'] },
        };
      },
      inject: [JwtKeyService],
    }),
  ],

  providers: [JwtKeyService],
  exports: [JwtModule],
})
export class SharedJwtModule {}
