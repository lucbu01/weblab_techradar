import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Env } from '../env/env';
import {
  AutoLoginPartialRoutesGuard,
  OidcSecurityService,
} from 'angular-auth-oidc-client';
import {
  combineLatest,
  filter,
  map,
  mergeMap,
  Observable,
  of,
  take,
  tap,
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Auth implements CanActivate {
  private readonly env = inject(Env);
  private readonly oidcService = inject(OidcSecurityService);
  private readonly oidcGuard = inject(AutoLoginPartialRoutesGuard);
  private readonly router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> {
    const requiredRoles = route.data?.['roles'] as string[] | undefined;

    return this.oidcGuard.canActivate(route, state).pipe(
      mergeMap((canActivate) => {
        if (!canActivate) return of(canActivate);
        if (!requiredRoles?.length) return of(true);

        return this.getUserInfo().pipe(
          map((userInfo) => {
            if (
              userInfo.appRoles.some((role) => requiredRoles.includes(role))
            ) {
              return true;
            }
            return this.router.createUrlTree(['/']);
          }),
        );
      }),
    );
  }

  getUserInfo(): Observable<UserInfo> {
    return combineLatest([
      this.env.environmentLoaded,
      this.oidcService.isAuthenticated$,
    ]).pipe(
      filter(([, auth]) => !!auth?.isAuthenticated),
      take(1),
      mergeMap(([env]) =>
        this.oidcService.getPayloadFromAccessToken().pipe(
          take(1),
          tap((tokenPayload) => console.log(tokenPayload)),
          map((tokenPayload) => ({
            username: tokenPayload.preferred_username,
            name: tokenPayload.name,
            givenName: tokenPayload.given_name,
            familyName: tokenPayload.family_name,
            email: tokenPayload.email,
            emailVerified: tokenPayload.email_verified,
            allowedOrigins: tokenPayload['allowed-origins'],
            appRoles:
              tokenPayload?.resource_access?.[env.oidcAudience]?.roles ?? [],
            locale: tokenPayload.locale,
          })),
        ),
      ),
    );
  }

  logoff() {
    this.oidcService.logoff().subscribe();
  }

  checkAuth() {
    return this.oidcService.checkAuth();
  }

  authorize() {
    return this.oidcService.authorize();
  }
}

export interface UserInfo {
  username: string;
  name: string;
  givenName: string;
  familyName: string;
  email: string;
  emailVerified: boolean;
  allowedOrigins: string[];
  appRoles: string[];
  locale?: string;
}
