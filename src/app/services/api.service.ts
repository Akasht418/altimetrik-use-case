import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<any> {
    return this.http.get('dashboard.json').pipe(delay(1000));
  }
}
