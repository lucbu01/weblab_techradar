import { Injectable } from '@angular/core';
import { ReplaySubject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Environment } from '@techradar/libs';

@Injectable({ providedIn: 'root' })
export class Env {
  private environment?: Environment;
  readonly environmentLoaded = new ReplaySubject<Environment>();

  loadEnv(http: HttpClient) {
    return http.get<Environment>('/api/environment').pipe(
      tap((env) => {
        this.environment = env;
        this.environmentLoaded.next(this.environment);
        this.environmentLoaded.complete();
      }),
    );
  }

  getEnvironment() {
    return this.environment;
  }
}
