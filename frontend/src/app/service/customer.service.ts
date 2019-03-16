import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Auction, Customer, Token } from '@app/interface';
import { Apollo } from 'apollo-angular';
import graphqlTag from 'graphql-tag';
import { JwtHelperService } from '@auth0/angular-jwt';

import { AuthService } from '@app/service/auth.service';
import { auctionAdd, customerLogin } from '@app/mutation';
import { first, switchMap, take } from 'rxjs/operators';
import { LoadingService } from '@app/service/loading.service';
import { dispatch, select } from '@angular-redux/store';
import { ActionService } from '@app/service/action.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  @dispatch() customerSet = customer =>
    this.actionService.customerSet(customer)

  @select('token') readonly token$: Observable<Token | null>;
  @select('customer') readonly customer$: Observable<Customer | null>;
  private customerId: string;
  private customer: Customer;

  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private apollo: Apollo,
    private jwtHelperService: JwtHelperService,
    private loadingService: LoadingService,
    private actionService: ActionService,
  ) {
    this.init();
  }

  init() {
    this.token$.subscribe(token => this.setToken(token));
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
    this.fetchProfile().subscribe();
  }

  fetchProfile() {
    const observable = this.apollo
      .query({
        query: graphqlTag`
          query{
            me{
              customerId
              firstName
              lastName
            }
          }
        `,
      })
      .pipe(
        first(),
        switchMap((result: any) => {
          this.customerSet({
            customerId: result.data.me.customerId,
            firstName: result.data.me.firstName,
            lastName: result.data.me.lastName,
          });
          return of(result.data.me);
        }),
      );
    return this.loadingService.auto(observable);
  }

  signin({ login, password }): Observable<any> {
    const observable = this.apollo
      .mutate({
        mutation: customerLogin,
        variables: {
          login,
          password,
        },
      }).pipe(
        first(),
        switchMap((result) => {
          this.authService.setToken(result.data.customerLogin.token);
          return of(result.data.customerLogin.token);
        }),
      );
    return this.loadingService.auto(observable, 'auction-process');
  }
}
