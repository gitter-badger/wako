import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private appService: AppService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const url: string = state.url;

    return this.checkAuth(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): Observable<boolean> {
    const url = `/${route.path}`;

    return this.checkAuth(url);
  }

  private checkAuth(url: string): Observable<boolean> {
    return this.appService.isAuthenticated$.pipe(
      map(isAuthenticated => {
        console.log('isAuthenticated', isAuthenticated);
        if (!isAuthenticated) {
          console.log('Not authorized to access', url, ' when unAuth. redirect to /login');

          this.router.navigate(['/login']);
        }
        return isAuthenticated;
      })
    );
  }
}
