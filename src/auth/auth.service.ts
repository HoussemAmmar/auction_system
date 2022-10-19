import { Inject, Injectable } from '@nestjs/common';
import { AbstractService } from '../abstract/abstract.service';
import { Auth } from './auth.schema';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/user.schema';
import { Model } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class AuthService extends AbstractService<Auth> {
  constructor(
    @InjectModel(User.name) private authModel: Model<Auth>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    super(authModel, logger);
  }
  protected modelName = Auth.name;
}
