import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CreateTechnology,
  Technology,
  TechnologyList,
  UpdateTechnology,
  UpsertTechnologyClassification,
} from '@techradar/libs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TechnologyApi {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/technologies';

  getTechnologies(
    published?: boolean,
    name?: string,
    category?: string | string[],
    ring?: string | string[],
    sortColumn?: string,
    sortDirection?: string,
  ): Observable<TechnologyList[]> {
    const params: {
      published?: boolean;
      name?: string;
      category?: string | string[];
      ring?: string | string[];
      sortColumn?: string;
      sortDirection?: string;
    } = {};
    if (published !== undefined && published !== null) {
      params.published = published;
    }
    if (name) {
      params.name = name;
    }
    if (category) {
      params.category = category;
    }
    if (ring) {
      params.ring = ring;
    }
    if (sortColumn) {
      params.sortColumn = sortColumn;
    }
    if (sortDirection) {
      params.sortDirection = sortDirection;
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
