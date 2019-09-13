import { Injectable } from '@angular/core';
import { PreloadingStrategy } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomPreloadingService implements PreloadingStrategy {
  preload(route: Route, fn: () => Observable<any>): Observable<any> {
    if(route.data && route.data['preload']){
      return fn();
    } else{
      return of(null);
    }
  }

  constructor() { }
}
