import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  HttpBackend,
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  authInterceptor,
  OidcSecurityService,
  OpenIdConfiguration,
  provideAuth,
  StsConfigHttpLoader,
  StsConfigLoader,
} from 'angular-auth-oidc-client';
import { Env } from './env/env';
import { map, switchMap, take } from 'rxjs';

const appInitializerFn = () => {
  return inject(Env).loadEnv(new HttpClient(inject(HttpBackend)));
};

const authCheckInitializerFn = () => {
  const env = inject(Env);
  const oidc = inject(OidcSecurityService);
  return env.environmentLoaded.pipe(
    take(1),
    switchMap(() => oidc.checkAuth()),
    take(1),
  );
};

const authFactory = (environmentService: Env) => {
  const config$ = environmentService.environmentLoaded.pipe(
    map((env): OpenIdConfiguration => {
      return {
        authority: env.oidcIssuer,
        redirectUrl: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
        clientId: env.oidcClient,
        scope: 'openid profile roles',
        responseType: 'code',
        autoUserInfo: true,
        startCheckSession: true,
        silentRenew: true,
        renewTimeBeforeTokenExpiresInSeconds: 30,
        ignoreNonceAfterRefresh: true,
        useRefreshToken: true,
        secureRoutes: ['/api'],
      };
    }),
  );
  return new StsConfigHttpLoader(config$);
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAppInitializer(appInitializerFn),
    provideRouter(appRoutes),
    provideAuth({
      loader: {
        provide: StsConfigLoader,
        useFactory: authFactory,
        deps: [Env],
      },
    }),
    provideAppInitializer(authCheckInitializerFn),
    provideHttpClient(withInterceptors([authInterceptor()])),
  ],
};
