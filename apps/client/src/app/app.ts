import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Auth } from './auth/auth';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { toSignal } from '@angular/core/rxjs-interop';
import { Env } from './env/env';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  imports: [
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatSidenavModule,
    MatListModule,
  ],
  selector: 'techradar-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly auth = inject(Auth);
  protected readonly http = inject(HttpClient);
  protected readonly env = inject(Env);
  protected readonly breakpointObserver = inject(BreakpointObserver);
  protected readonly environment = toSignal(this.env.environmentLoaded);
  protected readonly manageUserUrl = computed(() => {
    return (
      this.environment()?.oidcIssuer?.split('/realms')[0] +
      '/admin/techradar/console/#/techradar/users'
    );
  });
  protected readonly user = toSignal(this.auth.getUserInfo());
  protected readonly hideSidebar = toSignal(
    this.breakpointObserver
      .observe([
        Breakpoints.Handset,
        Breakpoints.TabletPortrait,
        Breakpoints.WebPortrait,
      ])
      .pipe(map((result) => result.matches)),
  );

  logoff() {
    this.auth.logoff();
  }

  login() {
    this.auth.authorize();
  }
}
