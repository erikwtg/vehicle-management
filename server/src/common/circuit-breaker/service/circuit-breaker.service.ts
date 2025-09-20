import { Injectable, Logger } from '@nestjs/common';
import CircuitBreaker from 'opossum';
import { RpcServiceUnavailableError } from '../../errors/rpc.errors';

@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);
  private breakers = new Map<string, CircuitBreaker>();

  create<TArgs extends any[], TReturn>(
    name: string,
    action: (...args: TArgs) => Promise<TReturn>,
    options?: CircuitBreaker.Options,
  ): CircuitBreaker<TArgs, TReturn> {
    if (this.breakers.has(name)) {
      return this.breakers.get(name) as CircuitBreaker<TArgs, TReturn>;
    }

    const breaker = new CircuitBreaker<TArgs, TReturn>(action, {
      timeout: 5000,
      errorThresholdPercentage: 50,
      resetTimeout: 10000,
      ...options,
    });

    breaker.on('open', () =>
      this.logger.warn(`Circuit breaker OPEN for action: ${action.name}`),
    );
    breaker.on('halfOpen', () =>
      this.logger.log(`Circuit breaker HALF-OPEN for action: ${action.name}`),
    );
    breaker.on('close', () =>
      this.logger.log(`Circuit breaker CLOSED for action: ${action.name}`),
    );

    breaker.on('failure', (error) =>
      this.logger.error(
        `Circuit breaker FAILURE for action: ${action.name} -> ${error.message}`,
      ),
    );

    breaker.on('timeout', () =>
      this.logger.error(`Circuit breaker TIMEOUT for action: ${action.name}`),
    );

    breaker.on('reject', () =>
      this.logger.warn(
        `Circuit breaker REJECTED request for action: ${action.name}`,
      ),
    );

    breaker.on('fallback', () =>
      this.logger.log(
        `Circuit breaker FALLBACK invoked for action: ${action.name}`,
      ),
    );

    this.breakers.set(name, breaker);

    return breaker;
  }

  async call<TArgs extends any[], TReturn>(
    name: string,
    ...args: TArgs
  ): Promise<TReturn> {
    const breaker = this.breakers.get(name);
    if (!breaker)
      throw new RpcServiceUnavailableError(`Breaker ${name} not found`);

    try {
      return (await breaker.fire(...args)) as TReturn;
    } catch (err: any) {
      if (err.message.includes('Timed out after')) {
        throw new RpcServiceUnavailableError('Serviço indisponível');
      }

      throw err;
    }
  }
}
