import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';

type JwtPayload = Record<string, unknown>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    const issuer =
      process.env.OIDC_ISSUER ?? 'http://localhost:8180/realms/techradar';
    const audience = process.env.OIDC_AUDIENCE ?? 'techradar-api';

    // Keycloak: <issuer>/protocol/openid-connect/certs
    // Auth0: https://<domain>/.well-known/jwks.json
    const jwksUri = `${issuer}/protocol/openid-connect/certs`;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer,
      audience,
      algorithms: ['RS256'],
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri,
      }),
    });
  }

  validate(payload: JwtPayload) {
    const roles =
      payload?.resource_access?.[process.env.OIDC_AUDIENCE ?? 'techradar']
        ?.roles ?? [];
    return { ...payload, roles };
  }
}
