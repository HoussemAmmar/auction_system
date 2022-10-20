import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Inject } from '@nestjs/common';

@Processor('item-queue')
export class ItemConsumer {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Process('test')
  async test(job: Job<any>) {
    this.logger.log('error', 'test');
  }
}
