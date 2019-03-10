import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import graphqlTag from 'graphql-tag';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Auction, Customer } from '@app/interface';
import { ApolloQueryResult } from 'apollo-client';
import { catchError, first, map, switchMap, take, tap } from 'rxjs/operators';
import { auctionFetchAll, auctionFetchOne, auctionRemove, auctionUpdate } from '@app/mutation';
import { auctionAdd } from '@app/mutation/auction-add';
import { LoadingService } from '@app/service/loading.service';

@Injectable({
  providedIn: 'root',
})
export class AuctionService {
  auction$ = new BehaviorSubject<Auction>(null);
  auctions$ = new BehaviorSubject<Auction[]>([]);
  auction: Auction = null;
  auctions: Auction[] = [];

  constructor(
    private apollo: Apollo,
    private loadingService: LoadingService,
  ) {
    this.init();
  }

  init() {
    this.auctions$.subscribe(auctions => this.auctions = auctions);
  }

  fetchAll(): Observable<any> {
    const observable = this.apollo
      .watchQuery({
        query: auctionFetchAll,
      })
      .valueChanges.pipe(
        take(1),
        switchMap((result: any) => {
          this.auctions$.next(result.data.auctions as Auction[]);
          return of(result.data.auctions);
        }),
      );
    return this.loadingService.auto(observable, 'auction-list');
  }

  fetchOne(auctionId: number): Observable<any> {
    const observable = this.apollo
      .watchQuery({
        query: auctionFetchOne,
        variables: {
          auctionId,
        },
      })
      .valueChanges.pipe(
        take(1),
        switchMap((result: any) => {
          this.auction$.next(result.data.auction as Auction);
          return of(result.data.auction);
        }),
      );
    return this.loadingService.auto(observable, 'auction-detail');
  }

  remove(auctionId: number): Observable<any> {
    const observable = this.apollo
      .mutate({
        mutation: auctionRemove,
        variables: {
          auctionId,
        },
      }).pipe(
        take(1),
        switchMap((result) => {
          const index = this.auctions.findIndex(auction => auction.auctionId === auctionId);
          if (index !== -1) {
            this.auctions.splice(index, 1);
          }
          this.auctions$.next(this.auctions);
          return of(null);
        }),
      );
    return this.loadingService.auto(observable, 'auction-process');
  }

  add({ title, path }): Observable<any> {
    const observable = this.apollo
      .mutate({
        mutation: auctionAdd,
        variables: {
          title,
          path,
        },
      }).pipe(
        take(1),
        switchMap((result) => {
          this.auctions.push(result.data.auctionAdd.auction as Auction);
          this.auctions$.next(this.auctions);
          return of(result.data.auctionAdd.auction);
        }),
      );
    return this.loadingService.auto(observable, 'auction-process');
  }

  update(auctionId, { title, path }): Observable<any> {
    const observable = this.apollo
      .mutate({
        mutation: auctionUpdate,
        variables: {
          auctionId,
          title,
          path,
        },
      }).pipe(
        take(1),
        switchMap((result) => {
          this.auction = result.data.auctionUpdate.auction as Auction;
          this.auction$.next(this.auction);

          const auction = this.auctions
            .find(auction => auction.auctionId === this.auction.auctionId);

          if (auction) {
            Object.assign(auction, this.auction);
            this.auctions$.next(this.auctions);
          }

          return of(result.data.auctionUpdate.auction);
        }),
      );
    return this.loadingService.auto(observable, 'auction-process');
  }
}
