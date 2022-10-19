import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AbstractService } from '../abstract/abstract.service';
import { Auth } from './auth.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CreateUserWithEmailAndPasswordDto } from './auth.dto';
import { SignUpResponseType } from './auth.type';
import * as crypto from 'crypto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService extends AbstractService<Auth> {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<Auth>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private userService: UserService,
    private jwtService: JwtService,
  ) {
    super(authModel, logger);
  }
  protected modelName = Auth.name;

  async signUpWithEmailAndPassword(
    createUserWithEmailAndPasswordDto: CreateUserWithEmailAndPasswordDto,
  ): Promise<SignUpResponseType> {
    let auth = await this.findOne(
      {
        email: createUserWithEmailAndPasswordDto.email,
      },
      null,
      { collation: { locale: 'en', strength: 2 } },
    );
    if (auth) throw new BadRequestException('EMAIL_ALREADY_USED');

    const passwordHashed = this.hash(
      createUserWithEmailAndPasswordDto.password,
    );

    const user = await this.userService.createUser({
      firstName: createUserWithEmailAndPasswordDto.firstName,
      lastName: createUserWithEmailAndPasswordDto.lastName,
      phoneNumber: createUserWithEmailAndPasswordDto.phoneNumber,
      address: createUserWithEmailAndPasswordDto.address,
      birthday: createUserWithEmailAndPasswordDto.birthday,
    });

    auth = await this.create({
      email: createUserWithEmailAndPasswordDto.email,
      password: passwordHashed,
      user: user._id,
    });
    if (!auth) await this.userService.deleteUser(user._id);
    const access_token = this.accessToken(auth, user._id);
    return { access_token };
  }

  hash(token: string) {
    return crypto.createHash('sha256').update(token).digest('base64');
  }

  accessToken(auth: Auth, user: Types.ObjectId) {
    return this.jwtService.sign(
      { _id: auth._id, user: user._id },
      {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
      },
    );
  }
}
