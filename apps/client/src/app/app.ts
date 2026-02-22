import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Auth } from './auth/auth';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/list';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

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
  protected readonly user = toSignal(this.auth.getUserInfo());
  protected readonly apiCall = toObservable(this.user).pipe(
    switchMap((ui) => {
      console.log(ui);
      return this.http.get('/api');
    }),
  );

  ngOnInit() {
    this.apiCall.subscribe((res) => console.log('api call worked: ', res));
  }

  logoff() {
    this.auth.logoff();
  }

  login() {
    this.auth.authorize();
  }
}
