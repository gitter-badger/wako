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
import { map } from 'rxjs/operators';
import { AppService } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class UnAuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private appService: AppService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const url: string = state.url;

    return this.checkUnAuth(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): Observable<boolean> {
    const url = `/${route.path}`;

    return this.checkUnAuth(url);
  }

  private checkUnAuth(url: string): Observable<boolean> {
    return this.appService.isAuthenticated$.pipe(
      map(isAuthenticated => {
        if (isAuthenticated) {
          console.log('Not authorized to access to unAuth route', url, 'when auth. Redirect to /');

          this.router.navigate(['/home']);
        }
        return !isAuthenticated;
      })
    );
  }
}
