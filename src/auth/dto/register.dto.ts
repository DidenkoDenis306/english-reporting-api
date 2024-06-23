import { IsBoolean, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @MinLength(8, {
    message: 'First name must be at least 8 characters long',
  })
  @IsString()
  firstName: string;

  @MinLength(8, {
    message: 'Last name must be at least 8 characters long',
  })
  @IsString()
  lastName: string;

  @MinLength(8, {
    message: 'Login must be at least 8 characters long',
  })
  @IsString()
  login: string;

  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  @IsString()
  password: string;

  @IsBoolean()
  isSpecial: boolean;
}
