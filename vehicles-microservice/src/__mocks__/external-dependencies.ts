export const mockRabbitMQClient = {
  connect: jest.fn().mockResolvedValue(undefined),
  close: jest.fn().mockResolvedValue(undefined),
  emit: jest.fn().mockResolvedValue(undefined),
  send: jest.fn().mockResolvedValue(undefined),
};

export const mockRedisService = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  exists: jest.fn(),
  expire: jest.fn(),
  ttl: jest.fn(),
  flushall: jest.fn(),
  disconnect: jest.fn(),
};

export const mockDatabase = {
  select: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  transaction: jest.fn(),
};

export const mockConfigService = {
  get: jest.fn((key: string) => {
    const config: Record<string, string> = {
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test_db',
      REDIS_HOST: 'localhost',
      REDIS_PORT: '6379',
      RABBITMQ_URL: 'amqp://localhost:5672',
      NODE_ENV: 'test',
    };
    return config[key];
  }),
};

export const resetAllMocks = () => {
  jest.clearAllMocks();

  Object.values(mockRabbitMQClient).forEach((mock) => {
    if (jest.isMockFunction(mock)) {
      mock.mockClear();
    }
  });

  Object.values(mockRedisService).forEach((mock) => {
    if (jest.isMockFunction(mock)) {
      mock.mockClear();
    }
  });

  Object.values(mockDatabase).forEach((mock) => {
    if (jest.isMockFunction(mock)) {
      mock.mockClear();
    }
  });
};
