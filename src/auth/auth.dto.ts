import { CreateUserDto } from '../user/user.dto';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserWithEmailAndPasswordDto extends CreateUserDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginWithEmailAndPasswordDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
