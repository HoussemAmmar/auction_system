import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Inject } from '@nestjs/common';
import { BullStatusCompleted, StatusEnum } from '../types/item.types';
import { ItemService } from './item.service';

@Processor('item')
export class ItemConsumer {
  constructor(
    private itemService: ItemService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Process('status-completed')
  async test(job: Job<BullStatusCompleted>) {
    this.logger.log('info', 'RECEIVED_JOB_STATUS_COMPLETED');
    try {
      await this.itemService.updateOne(
        { _id: job.data._id },
        { status: StatusEnum.completed },
      );
    } catch (e) {
      this.logger.error('UPDATE_STATUS_COMPLETED_FAILED', e);
    }
  }
}
