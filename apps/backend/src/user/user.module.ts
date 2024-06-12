import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CryptoModule } from '../crypto/crypto.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [PrismaModule, CryptoModule],
})
export class UserModule {}
