import { resetAllMocks } from './__mocks__/external-dependencies';

beforeEach(() => {
  resetAllMocks();
});

jest.mock('./redis/redis.service', () => ({
  RedisService: jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    exists: jest.fn(),
    expire: jest.fn(),
    ttl: jest.fn(),
    flushall: jest.fn(),
    disconnect: jest.fn(),
  })),
}));

jest.mock('./config/drizzle/config', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    transaction: jest.fn(),
  },
}));

jest.setTimeout(10000);
