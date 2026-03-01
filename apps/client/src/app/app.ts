import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Auth } from './auth/auth';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/list';
import { toSignal } from '@angular/core/rxjs-interop';
import { Env } from './env/env';

@Component({
  imports: [
    RouterModule,
    MatToolbar,
    MatButton,
    MatIconButton,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatDivider,
  ],
  selector: 'techradar-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected auth = inject(Auth);
  protected http = inject(HttpClient);
  protected env = inject(Env);
  protected environment = toSignal(this.env.environmentLoaded);
  protected manageUserUrl = computed(() => {
    return (
      this.environment()?.oidcIssuer?.split('/realms')[0] +
      '/admin/techradar/console/#/techradar/users'
    );
  });
  protected readonly user = toSignal(this.auth.getUserInfo());

  logoff() {
    this.auth.logoff();
  }

  login() {
    this.auth.authorize();
  }
}
