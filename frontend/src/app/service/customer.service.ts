import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { Customer } from '@app/interface';
import { Apollo } from 'apollo-angular';
import graphqlTag from 'graphql-tag';
import { JwtHelperService } from '@auth0/angular-jwt';

import { AuthService } from '@app/service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private customerId: string;
  private customer: Customer;
  customer$ = new BehaviorSubject<Customer>(null);

  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private apollo: Apollo,
    private jwtHelperService: JwtHelperService,
  ) {
    this.init();
  }

  init() {
    this.authService.token$.subscribe(token => this.setToken(token));
    this.customer$.subscribe(customer => this.customer = customer);
  }

  setToken(token: string) {
    const tokenDecoded = this.jwtHelperService.decodeToken(token);

    if (!tokenDecoded || !tokenDecoded.customerId) {
      return;
    }

    if (this.customerId === tokenDecoded.customerId) {
      return;
    }

    this.customerId = tokenDecoded.customerId;
    this.fetchProfile();
  }

  fetchProfile() {
    this.apollo
      .watchQuery({
        query: graphqlTag`
          query {
            me{
              customerId
              firstName
              lastName
            }
          }
        `,
      })
      .valueChanges.subscribe((customer: any) => this.customer$.next({
        customerId: customer.customerId,
        firstName: customer.firstName,
        lastName: customer.lastName,
      }));
  }
}
