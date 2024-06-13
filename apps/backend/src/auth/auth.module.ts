import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CryptoModule } from 'src/crypto/crypto.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [PrismaModule, CryptoModule],
})
export class AuthModule {}
