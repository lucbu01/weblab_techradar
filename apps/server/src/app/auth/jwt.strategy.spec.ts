import { JwtStrategy } from './jwt.strategy';

jest.mock('jwks-rsa', () => ({
  passportJwtSecret: jest.fn(() => jest.fn()),
}));

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    process.env.OIDC_AUDIENCE = 'techradar-api';
    strategy = new JwtStrategy();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should extract roles from resource_access in the payload', () => {
      const payload = {
        sub: '1234567890',
        name: 'John Doe',
        resource_access: {
          'techradar-api': {
            roles: ['ADMIN', 'USER'],
          },
        },
      };

      const result: any = strategy.validate(payload);

      expect(result.roles).toEqual(['ADMIN', 'USER']);
      expect(result.sub).toBe('1234567890');
      expect(result.name).toBe('John Doe');
    });

    it('should return empty roles if resource_access for the audience is missing', () => {
      const payload = {
        sub: '1234567890',
        resource_access: {
          'other-api': {
            roles: ['ADMIN'],
          },
        },
      };

      const result: any = strategy.validate(payload);

      expect(result.roles).toEqual([]);
    });

    it('should return empty roles if resource_access is missing entirely', () => {
      const payload = {
        sub: '1234567890',
      };

      const result: any = strategy.validate(payload);

      expect(result.roles).toEqual([]);
    });

    it('should work with default audience if OIDC_AUDIENCE env is not set', () => {
      delete process.env.OIDC_AUDIENCE;
      // Note: JwtStrategy captures env vars in constructor, so we need a new instance
      const defaultStrategy = new JwtStrategy();

      const payload = {
        resource_access: {
          techradar: {
            // default value in strategy is 'techradar'
            roles: ['EMPLOYEE'],
          },
        },
      };

      const result: any = defaultStrategy.validate(payload);

      expect(result.roles).toEqual(['EMPLOYEE']);
    });
  });
});
