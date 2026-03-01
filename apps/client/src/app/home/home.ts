import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Auth, UserInfo } from '../auth/auth';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Env } from '../env/env';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'techradar-home',
  imports: [MatButton, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  protected readonly auth = inject(Auth);
  protected env = inject(Env);
  protected environment = toSignal(this.env.environmentLoaded);
  protected manageUserUrl = computed(() => {
    return (
      this.environment()?.oidcIssuer?.split('/realms')[0] +
      '/admin/techradar/console/#/techradar/users'
    );
  });
  protected readonly user = signal<UserInfo | undefined>(undefined);

  ngOnInit() {
    this.auth.getUserInfo().subscribe((ui) => this.user.set(ui));
  }
}
