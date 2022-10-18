import { Inject, Injectable } from '@nestjs/common';
import { AbstractService } from '../abstract/abstract.service';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService extends AbstractService<User> {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    super(userModel, logger);
  }
  protected modelName = User.name;
}
