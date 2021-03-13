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
  userSubject = new BehaviorSubject<any>(null);
  get activeUser() {
    return this.userSubject.value;
  }
  set activeUser(user: any) {
    !user
      ? localStorage.removeItem('user')
      : localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }
  constructor(
    private _HttpClient: HttpClient,
    private _CookieService: CookieService,
    private router: Router
  ) {
    this.getSavedUser();
  }
  getSavedUser() {
    let currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    if (!this._CookieService.check('Token') || !currentUser) {
      this.logout();
    } else {
      this.activeUser = currentUser;
    }
  }
  public login(user: any): Observable<any> {
    return this._HttpClient
      .post(`${environment.api}/api/login`, user, { responseType: 'json' })
      .pipe(
        map((response: any) => {
          if (response) {
            this._CookieService.set('Token', response['token']);
            this.router.navigate([this.redirectUrl]);
            this.getMe().subscribe((res) => {});
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
    return this._HttpClient.get(`${environment.api}/api/me`).pipe(
      map((response) => {
        if (response) {
          this.activeUser = response;
        }
        return response;
      })
    );
  }
  public updateUser(user: any) {
    return this._HttpClient.put(`${environment.api}/api/me`, user);
  }
  public logout() {
    this._CookieService.delete('Token');
    this.activeUser = null;
    this.router.navigate(['/login']);
  }
}
