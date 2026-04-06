import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import * as Papa from 'papaparse';
import { CityItem } from '../models/city.models';

@Injectable({ providedIn: 'root' })
export class CityService {
  private catalog: CityItem[] = [];

  constructor(private http: HttpClient) {}

  fetchCityCatalog(): Observable<CityItem[]> {
    return this.http.get('/assets/top1000_cities.csv', { responseType: 'text' })
      .pipe(
        map(csv => {
          const parsed = Papa.parse(csv, {
            header: true,
            skipEmptyLines: true
          });

          return parsed.data.map((row: any) => ({
            name: row.name,
            lat: parseFloat(row.lat),
            lon: parseFloat(row.lon),
            population: parseInt(row.population, 10)
          }));
        })
      );
  }

  storeCatalog(data: CityItem[]): void {
    this.catalog = data;
  }

  getCatalog(): CityItem[] {
    return this.catalog;
  }

  searchLocal(query: string): CityItem[] {
    if (!query || query.length < 2) return [];

    const q = query.toLowerCase();

    return this.catalog
      .map(c => ({
        ...c,
        _rank: this.getMatchScore(c.name.toLowerCase(), q)
      }))
      .filter(c => c._rank > 0)
      .sort((a, b) => b._rank - a._rank)
      .slice(0, 8);
  }

  private getMatchScore(name: string, query: string): number {
    if (name === query) return 4;
    if (name.startsWith(query)) return 3;
    if (name.includes(query)) return 2;
    return 0;
  }

  formatPop(pop: number): string {
    if (pop >= 1_000_000) {
      return (pop / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (pop >= 1_000) {
      return Math.round(pop / 1_000) + 'K';
    }
    return String(pop);
  }
}