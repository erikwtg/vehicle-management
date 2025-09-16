import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom, TimeoutError } from 'rxjs';
import { timeout } from 'rxjs/operators';

@Injectable()
export class VehiclesPublisher {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://info:info@vehicle_management_rabbitmq:5672'],
        queue: 'vehicles_queue',
        queueOptions: { durable: true },
      },
    });
  }

  publish<T>(event: string, data: T) {
    return this.client.emit(event, data);
  }

  async requestWithId<R>(pattern: string, id: number): Promise<R> {
    try {
      return await firstValueFrom(
        this.client.send<R>(pattern, id).pipe(timeout(5000)),
      );
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new Error('Request timed out');
      }
      throw error;
    }
  }

  async requestWithoutId<R>(pattern: string): Promise<R> {
    try {
      return await firstValueFrom(
        this.client.send<R>(pattern, {}).pipe(timeout(5000)),
      );
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new Error('Request timed out');
      }
      throw error;
    }
  }

  async requestWithData<T, R>(pattern: string, data: T): Promise<R> {
    try {
      return await firstValueFrom(
        this.client.send<R>(pattern, data).pipe(timeout(5000)),
      );
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new Error('Request timed out');
      }
      throw error;
    }
  }
}
