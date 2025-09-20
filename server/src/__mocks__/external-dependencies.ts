export const mockRabbitMQClient = {
  connect: jest.fn().mockResolvedValue(undefined),
  close: jest.fn().mockResolvedValue(undefined),
  emit: jest.fn().mockResolvedValue(undefined),
  send: jest.fn().mockResolvedValue(undefined),
};

export const mockCircuitBreaker = {
  fire: jest.fn(),
  open: jest.fn(),
  close: jest.fn(),
  halfOpen: jest.fn(),
  fallback: jest.fn(),
  on: jest.fn(),
};

export const mockConfigService = {
  get: jest.fn((key: string) => {
    const config: Record<string, string> = {
      RABBITMQ_URL: 'amqp://localhost:5672',
      MICROSERVICE_QUEUE: 'vehicles_queue',
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

  Object.values(mockCircuitBreaker).forEach((mock) => {
    if (jest.isMockFunction(mock)) {
      mock.mockClear();
    }
  });
};
