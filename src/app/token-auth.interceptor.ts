import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenAuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let token : string | null =localStorage.getItem('token');
    if(token !=null)
    {
      let modRequest = request.clone({
        headers: request.headers.set('Authorization', token)
      });
      return next.handle(modRequest);
    }
    return next.handle(request);
  }
}
