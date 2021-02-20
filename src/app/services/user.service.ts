import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  redirectUrl = '/';

  constructor(
    private _HttpClient: HttpClient,
    private _CookieService: CookieService,
    private router: Router
  ) {}
  public login(user: any): Observable<any> {
    return this._HttpClient
      .post(`${environment.api}/api/login`, user, { responseType: 'json' })
      .pipe(
        map((response: any) => {
          if (response) {
            this._CookieService.set('Token', response['token']);

            this.router.navigate([this.redirectUrl]);
          }
        })
      );
  }
  public register(user: any): Observable<any> {
    return this._HttpClient
      .post(`${environment.api}/api/signup`, user, { responseType: 'text' })
      .pipe(
        map((response) => {
          if (response) {
            this.router.navigate(['/login']);
          }
        })
      );
  }
  public deleteUser() {
    return this._HttpClient.delete(`${environment.api}/api/me`, {
      responseType: 'text',
    });
  }
  public getMe() {
    return this._HttpClient.get(`${environment.api}/api/me`);
  }
  public updateUser(user: any) {
    return this._HttpClient.put(`${environment.api}/api/me`, {
      name: user.name,
      email: user.email,
      current_password: user.password,
    });
  }
  public logout() {
    this._CookieService.delete('Token');
    this.router.navigate(['/register']);
  }
}
