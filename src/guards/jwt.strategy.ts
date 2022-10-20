import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { env } from 'process';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      expiresIn: env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
      secretOrKey: env.JWT_ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: any) {
    if (payload.exp > Date.now()) {
      throw new UnauthorizedException();
    } else {
      delete payload.exp;
      delete payload.iat;
      return payload;
    }
  }
}
