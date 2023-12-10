import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Laptop } from '../models/laptop.model';

@Injectable({
  providedIn: 'root',
})
export class LaptopService {
  private apiUrl = 'http://localhost:3000/laptops'; // Update with your API endpoint

  constructor(private http: HttpClient) {}

  getLaptops(): Observable<Laptop[]> {
    return this.http.get<Laptop[]>(this.apiUrl);
  }

  getLaptopById(id: string): Observable<Laptop> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Laptop>(url);
  }

  createLaptop(laptop: Laptop): Observable<Laptop> {
    return this.http.post<Laptop>(this.apiUrl, laptop);
  }

  updateLaptop(laptop: Laptop): Observable<Laptop> {
    const url = `${this.apiUrl}/${laptop.id}`;
    return this.http.put<Laptop>(url, laptop);
  }

  deleteLaptop(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
  searchLaptops(searchTerm: string): Observable<Laptop[]> {
    const url = `${this.apiUrl}?modelName_like=${searchTerm}`;
    return this.http
      .get<Laptop[]>(url)
      .pipe(catchError(this.handleError<Laptop[]>('searchLaptops', [])));
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      // You can log the error to a logging service or display a user-friendly message
      return throwError(result as T);
    };
  }
}
