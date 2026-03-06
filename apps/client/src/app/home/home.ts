import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Auth, UserInfo } from '../auth/auth';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Env } from '../env/env';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'techradar-home',
  imports: [MatButtonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  protected readonly auth = inject(Auth);
  protected readonly env = inject(Env);
  protected readonly environment = toSignal(this.env.environmentLoaded);
  protected readonly manageUserUrl = computed(() => {
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
