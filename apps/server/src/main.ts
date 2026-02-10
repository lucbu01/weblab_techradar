import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * This is not a production server yet!
   * This is only a minimal backend to get started.
   */

  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const issuer =
    process.env.OIDC_ISSUER ?? 'http://localhost:8180/realms/techradar';
  const config = new DocumentBuilder()
    .setTitle('Technology radar')
    .setDescription('The technology radar API description')
    .setVersion('1.0')
    .addTag('technologies')
    .addTag('environment')
    .addOAuth2(
      {
        type: 'oauth2',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        flows: {
          authorizationCode: {
            authorizationUrl: `${issuer}/protocol/openid-connect/auth`,
            tokenUrl: `${issuer}/protocol/openid-connect/token`,
            refreshUrl: `${issuer}/protocol/openid-connect/token`,
            scopes: {
              openid: 'OpenID Connect basic profile',
              profile: 'Access to your user profile information',
              roles: 'Access to your user roles',
            },
          },
        },
        description: 'Login via Keycloak (OpenID Connect).',
      },
      'keycloak',
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory(), {
    swaggerOptions: {
      initOAuth: {
        clientId: process.env.OIDC_CLIENT ?? 'techradar',
        scopes: ['openid', 'profile', 'roles'],
        usePkceWithAuthorizationCodeGrant: true,
      },
      filter: true,
      initWithLoginButton: true,
      persistAuthorization: true,
    },
    useGlobalPrefix: true,
    customJsStr: `
    window.addEventListener('load', function() {
        const ui = window.ui;
        if (ui) {
          window.ui.getConfigs().oauth2RedirectUrl = window.location.origin + window.location.pathname + '/oauth2-redirect.html';
        }
      });
    `,
  });
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
