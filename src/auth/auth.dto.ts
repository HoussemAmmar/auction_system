import { CreateUserDto } from '../user/user.dto';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserWithEmailAndPasswordDto extends CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
