import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private token: string = null;

  subscriptionClient: any;

  constructor(
    private cookieService: CookieService
  ) {
  }

  getToken() {
    if (this.token) {
      return this.token;
    }

    this.token = this.cookieService.get('authorization');

    return this.token;
  }
}
