import { Module } from '@nestjs/common';
import { ExceptionsFilter } from './filters/http-exception.filter';

@Module({
  providers: [ExceptionsFilter],
  exports: [ExceptionsFilter],
})
export class CommonModule {}
