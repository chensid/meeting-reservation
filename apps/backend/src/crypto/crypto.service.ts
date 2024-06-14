import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  generateSHA256Hash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }
  compareSHA256Hash(data: string, hash: string): boolean {
    return this.generateSHA256Hash(data) === hash;
  }
}
