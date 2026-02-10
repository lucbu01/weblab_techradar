import { Component, inject, OnInit, signal } from '@angular/core';
import { Auth, UserInfo } from '../auth/auth';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'techradar-home',
  imports: [MatButton, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  protected readonly auth = inject(Auth);
  protected readonly user = signal<UserInfo | undefined>(undefined);

  ngOnInit() {
    this.auth.getUserInfo().subscribe((ui) => this.user.set(ui));
  }
}
