import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { Customer } from '@app/interface';
import { LayoutService } from '@app/service/layout.service';
import { BehaviorSubject } from 'rxjs';
import { dispatch } from '@angular-redux/store';
import { ActionService } from '@app/service/action.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  @dispatch() tokenSet = token =>
    this.actionService.tokenSet(token)

  private token: string = null;
  subscriptionClient: any;

  constructor(
    private jwtHelperService: JwtHelperService,
    private layoutService: LayoutService,
    private router: Router,
    private cookieService: CookieService,
    private actionService: ActionService,
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

    this.setToken(token);
  }

  setToken(token: string | null) {
    if (token) {
      this.cookieService.set('authorization', token, 0, '/');
    } else {
      this.cookieService.delete('authorization');
    }

    this.token = token;
    this.tokenSet(this.token);
  }

  getToken() {
    return this.token;
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  authError() {
    this.token = null;
    this.tokenSet(this.token);
    const url = this.layoutService.isApp ? ['error'] : ['signin'];
    this.layoutService.navigate(url);
  }
}
