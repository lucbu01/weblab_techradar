import { Test, TestingModule } from '@nestjs/testing';
import { EnvironmentController } from './environment.controller';

describe('EnvironmentController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [EnvironmentController],
    }).compile();
  });

  describe('getData', () => {
    it('should return environment', () => {
      const environmentController = app.get<EnvironmentController>(
        EnvironmentController,
      );
      process.env.OIDC_ISSUER = 'test issuer';
      process.env.OIDC_AUDIENCE = 'test audience';
      process.env.OIDC_CLIENT = 'test client';
      expect(environmentController.getData()).toEqual({
        oidcIssuer: 'test issuer',
        oidcAudience: 'test audience',
        oidcClient: 'test client',
      });
    });
  });
});
