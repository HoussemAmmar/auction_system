import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseObject } from '../abstract/response.object';
import { User } from './user.schema';
import { UpdateUserProfileDto } from './user.dto';
import { Types } from 'mongoose';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('')
  async getUserProfile(@Request() req): Promise<ResponseObject<User>> {
    const data = await this.userService.findById(
      new Types.ObjectId(req.headers._id),
    );
    return new ResponseObject('FOUND_USER', data);
  }

  @Patch('')
  async updateUserProfile(
    @Request() req,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<ResponseObject<User>> {
    const data = await this.userService.findByIdAndUpdate(
      new Types.ObjectId(req.headers._id),
      updateUserProfileDto,
    );

    return new ResponseObject('USER_UPDATED', data);
  }
}
