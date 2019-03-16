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
import { ActionService } from '@app/service/action.service';
import { dispatch, select } from '@angular-redux/store';
import { IAppState } from '@app/store';

@Injectable({
  providedIn: 'root',
})
export class AuctionService {
  @select('auctionAll') readonly auctions$: Observable<Auction[]>;
  @dispatch() auctionAll = auctions =>
    this.actionService.auctionAll(auctions)
  @dispatch() auctionOne = (auctionId, auction) =>
    this.actionService.auctionOne(auctionId, auction)
  @dispatch() auctionRemove = auctionId =>
    this.actionService.auctionRemove(auctionId)

  private auctions: Auction[] = [];

  constructor(
    private apollo: Apollo,
    private loadingService: LoadingService,
    private actionService: ActionService,
  ) {
    this.init();
  }

  init() {
    this.auctions$.subscribe(auctions => this.auctions = auctions);
  }

  fetchAll(): Observable<any> {
    const observable = this.apollo
      .query({
        query: auctionFetchAll,
      })
      .pipe(
        take(1),
        switchMap((result: any) => {
          this.auctionAll(result.data.auctions);
          return of(result.data.auctions);
        }),
      );
    return this.loadingService.auto(observable, 'auction-list');
  }

  fetchOne(auctionId: string): Observable<any> {
    const observable = this.apollo
      .query({
        query: auctionFetchOne,
        variables: {
          auctionId,
        },
      })
      .pipe(
        take(1),
        switchMap((result: any) => {
          this.auctionOne(auctionId, result.data.auction);
          return of(result.data.auction);
        }),
      );
    return this.loadingService.auto(observable, 'auction-detail');
  }

  remove(auctionId: string): Observable<any> {
    const observable = this.apollo
      .mutate({
        mutation: auctionRemove,
        variables: {
          auctionId,
        },
      })
      .pipe(
        take(1),
        switchMap((result) => {
          this.auctionRemove(auctionId);

          const index = this.auctions.findIndex(auction => auction.auctionId === auctionId);
          if (index !== -1) {
            this.auctions.splice(index, 1);
          }

          this.auctionAll(this.auctions);

          this.apollo.getClient().writeQuery({
            query: auctionFetchAll,
            data: {
              auctions: this.auctions,
            },
          });

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
      })
      .pipe(
        take(1),
        switchMap((result) => {
          const auction = result.data.auctionAdd.auction as Auction;
          this.auctions.push(auction);

          this.auctionOne(auction.auctionId, auction);
          this.auctionAll(this.auctions);

          this.apollo.getClient().writeQuery({
            query: auctionFetchOne,
            variables: {
              auctionId: auction.auctionId,
            },
            data: {
              auction,
            },
          });

          this.apollo.getClient().writeQuery({
            query: auctionFetchAll,
            data: {
              auctions: this.auctions,
            },
          });
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
      })
      .pipe(
        take(1),
        switchMap((result) => {
          const auctionUpdated = result.data.auctionUpdate.auction as Auction;

          this.auctionOne(auctionUpdated.auctionId, auctionUpdated);

          const auction = this.auctions
            .find(auction => auction.auctionId === auctionUpdated.auctionId);

          if (auction) {
            Object.assign(auction, auctionUpdated);

            this.auctionAll(this.auctions);

            this.apollo.getClient().writeQuery({
              query: auctionFetchOne,
              variables: {
                auctionId,
              },
              data: {
                auction: auctionUpdated,
              },
            });

            this.apollo.getClient().writeQuery({
              query: auctionFetchAll,
              data: {
                auctions: this.auctions,
              },
            });
          }
          return of(result.data.auctionUpdate.auction);
        }),
      );
    return this.loadingService.auto(observable, 'auction-process');
  }
}
