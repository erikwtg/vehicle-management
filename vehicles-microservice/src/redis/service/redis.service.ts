import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_PORT
        ? parseInt(process.env.REDIS_PORT, 10)
        : 6379,
    });
  }

  async set(
    key: string,
    value: string,
    ttlSeconds: number = Number(process.env.REDIS_TTL) || 60 * 60 * 24,
  ) {
    if (ttlSeconds) {
      await this.client.set(key, value, 'EX', Number(ttlSeconds));
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    const value = ((await this.client.get(key)) as string) || null;
    return value;
  }

  async del(key: string) {
    const value = String((await this.client.del(key)) || 0);
    return value;
  }
}
