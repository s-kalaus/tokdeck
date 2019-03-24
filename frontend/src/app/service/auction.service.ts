import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { Auction } from '@app/interface';
import { first, switchMap } from 'rxjs/operators';
import { auctionFetchAll, auctionFetchOne, auctionRemove, auctionUpdate } from '@app/mutation';
import { auctionAdd } from '@app/mutation/auction-add';
import { LoadingService } from '@app/service/loading.service';
import { ActionService } from '@app/service/action.service';
import { dispatch } from '@angular-redux/store';
import { LayoutService } from '@app/service/layout.service';

@Injectable({
  providedIn: 'root',
})
export class AuctionService {
  @dispatch() auctionAll = auctions =>
    this.actionService.auctionAll(auctions)
  @dispatch() auctionOne = auction =>
    this.actionService.auctionOne(this.apollo.getClient(), auction)
  @dispatch() auctionAdd = auction =>
    this.actionService.auctionAdd(this.apollo.getClient(), auction)
  @dispatch() auctionRemove = auction =>
    this.actionService.auctionRemove(this.apollo.getClient(), auction)

  private auctions: Auction[] = [];

  constructor(
    private apollo: Apollo,
    private loadingService: LoadingService,
    private actionService: ActionService,
    public layoutService: LayoutService,
  ) {
  }

  fetchAll(): Observable<any> {
    const observable = this.apollo
      .query({
        query: auctionFetchAll,
      })
      .pipe(
        first(),
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
        first(),
        switchMap((result: any) => {
          this.auctionOne(result.data.auction);
          return of(result.data.auction);
        }),
      );
    return this.loadingService.auto(observable, 'auction-detail');
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
        first(),
        switchMap((result) => {
          this.auctionAdd(result.data.auctionAdd.auction);
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
        first(),
        switchMap((result) => {
          this.auctionOne(result.data.auctionUpdate.auction);
          return of(result.data.auctionUpdate.auction);
        }),
      );
    return this.loadingService.auto(observable, 'auction-process');
  }

  remove(auction: Auction): Observable<any> {
    const observable = this.apollo
      .mutate({
        mutation: auctionRemove,
        variables: {
          auctionId: auction.auctionId,
        },
      })
      .pipe(
        first(),
        switchMap(() => {
          this.auctionRemove(auction);
          return of(auction);
        }),
      );
    return this.loadingService.auto(observable, 'auction-process');
  }
}
