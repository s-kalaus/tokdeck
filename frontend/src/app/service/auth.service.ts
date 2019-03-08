import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { Customer } from '@app/interface';
import { LayoutService } from '@app/service/layout.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private token: string = null;
  token$ = new BehaviorSubject<string>(null);
  subscriptionClient: any;

  constructor(
    private jwtHelperService: JwtHelperService,
    private layoutService: LayoutService,
    private router: Router,
    private cookieService: CookieService,
  ) {

    this.init();
  }

  init() {
    this.checkToken();
  }

  checkToken() {
    const token = this.cookieService.get('authorization') || null;

    if (!token || this.jwtHelperService.isTokenExpired(token)) {
      return this.authError();
    }

    const tokenDecoded = this.jwtHelperService.decodeToken(token);

    if (!tokenDecoded || !tokenDecoded.customerId) {
      return this.authError();
    }

    this.token = token;
    this.token$.next(this.token);
  }

  getToken() {
    return this.token;
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  authError() {
    this.token = null;
    this.token$.next(this.token);
    this.layoutService.navigate('/error');
  }
}
