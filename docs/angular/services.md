# Angular Services

## What is a Service?
Services are singleton objects that provide specific functionality throughout the application. They are typically used for:
- Data fetching and sharing
- Business logic
- Logging
- Authentication

## Creating a Service
```bash
ng generate service data
# or shorthand
ng g s data
```

## Basic Service Example
```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'  // Makes it a singleton service
})
export class DataService {
  private data: any[] = [];

  constructor() { }

  getData(): any[] {
    return this.data;
  }

  addData(item: any): void {
    this.data.push(item);
  }
}
```

## Dependency Injection
```typescript
// In a component
constructor(private dataService: DataService) {}

// In a module (if not using providedIn: 'root')
@NgModule({
  providers: [DataService]
})
```

## HTTP Client
```typescript
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://api.example.com';

  constructor(private http: HttpClient) {}

  getItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/items`);
  }

  addItem(item: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/items`, item);
  }
}
```

## HTTP Interceptors
```typescript
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    }
    
    return next.handle(req);
  }
}
```

## Error Handling
```typescript
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

getItems(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/items`).pipe(
    catchError(error => {
      console.error('Error fetching items:', error);
      return throwError('Something went wrong');
    })
  );
}
```

## Service Lifecycle Hooks
- `ngOnInit()`: Not available in services
- `ngOnDestroy()`: Can be used to clean up subscriptions

## Best Practices
- Keep services focused on a single responsibility
- Use `providedIn: 'root'` for singleton services
- Handle errors appropriately
- Unsubscribe from observables to prevent memory leaks
- Use interfaces for request/response types
