import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Auth, UserInfo } from './auth/auth';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/list';

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
export class App implements OnInit {
  protected auth = inject(Auth);
  protected http = inject(HttpClient);
  protected readonly user = signal<UserInfo | undefined>(undefined);

  ngOnInit() {
    this.auth.getUserInfo().subscribe((ui) => {
      console.log(ui);
      this.user.set(ui);
      this.http
        .get('/api')
        .subscribe((res) => console.log('api call with auth worked: ', res));
    });
  }

  logoff() {
    this.auth.logoff();
  }

  login() {
    this.auth.authorize();
  }
}
