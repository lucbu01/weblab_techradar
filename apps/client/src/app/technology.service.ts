import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Technology } from '@techradar/libs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TechnologyService {
  private http = inject(HttpClient);
  private apiUrl = '/api/technologies';

  getTechnologies(published?: boolean): Observable<Technology[]> {
    const params: { published?: boolean } = {};
    if (published !== undefined) {
      params.published = published;
    }
    return this.http.get<Technology[]>(this.apiUrl, { params });
  }

  getTechnologyById(id: string): Observable<Technology> {
    return this.http.get<Technology>(`${this.apiUrl}/${id}`);
  }
}
