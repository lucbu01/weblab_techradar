import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CreateTechnology,
  Technology,
  UpdateTechnology,
  UpsertTechnologyClassification,
} from '@techradar/libs';
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

  createTechnology(technology: CreateTechnology): Observable<Technology> {
    return this.http.post<Technology>(this.apiUrl, technology);
  }

  updateTechnology(
    id: string,
    technology: UpdateTechnology,
  ): Observable<Technology> {
    return this.http.patch<Technology>(`${this.apiUrl}/${id}`, technology);
  }

  upsertTechnologyClassification(
    id: string,
    technology: UpsertTechnologyClassification,
  ): Observable<Technology> {
    return this.http.put<Technology>(
      `${this.apiUrl}/${id}/classification`,
      technology,
    );
  }

  publishTechnology(
    id: string,
    technology: UpsertTechnologyClassification,
  ): Observable<Technology> {
    return this.http.put<Technology>(
      `${this.apiUrl}/${id}/publication`,
      technology,
    );
  }

  deleteTechnology(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
