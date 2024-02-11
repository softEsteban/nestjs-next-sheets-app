import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTPayload } from './jwt.payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // secretOrKey: configService.get<string>('JWT_SECRET_KEY')
            secretOrKey: "jamaavbavbvb"
        });
    }

    async validate(payload: JWTPayload) {
        // Update the property names to match the actual payload structure
        const { email } = payload;

        if (!email) {
            throw new UnauthorizedException();
        }

        return { email };
    }
}