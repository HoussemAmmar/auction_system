import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseObject } from '../abstract/response.object';
import { SignUpResponseType } from './auth.type';
import { CreateUserWithEmailAndPasswordDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('')
  async signUpWithEmailAndPassword(
    @Body()
    createUserWithEmailAndPasswordDto: CreateUserWithEmailAndPasswordDto,
  ): Promise<ResponseObject<SignUpResponseType>> {
    const res = await this.authService.signUpWithEmailAndPassword(
      createUserWithEmailAndPasswordDto,
    );
    return new ResponseObject('SIGNUP_SUCCESS', res);
  }
}
