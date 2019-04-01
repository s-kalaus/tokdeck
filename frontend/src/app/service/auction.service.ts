import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { Auction, State } from '@app/interface';
import { first, switchMap } from 'rxjs/operators';
import { auctionFetchAll, auctionFetchOne, auctionRemove, auctionUpdate } from '@app/mutation';
import { auctionAdd } from '@app/mutation/auction-add';
import { LoadingService } from '@app/service/loading.service';
import { LayoutService } from '@app/service/layout.service';
import { AuctionAdd, AuctionAll, AuctionOne, AuctionRemove } from '@app/action';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class AuctionService {
  private auctions: Auction[] = [];

  constructor(
    private apollo: Apollo,
    private loadingService: LoadingService,
    public layoutService: LayoutService,
    private store: Store<any>,
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
          const payload = {
            auctions: result.data.auctions,
          };
          this.store.dispatch(new AuctionAll(payload));
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
          const payload = {
            auction: result.data.auction,
            apollo: this.apollo.getClient(),
          };
          this.store.dispatch(new AuctionOne(payload));
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
          const payload = {
            auction: result.data.auctionAdd.auction,
            apollo: this.apollo.getClient(),
          };
          this.store.dispatch(new AuctionAdd(payload));
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
          const payload = {
            auction: result.data.auctionUpdate.auction,
            apollo: this.apollo.getClient(),
          };
          this.store.dispatch(new AuctionOne(payload));
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
          const payload = {
            auction,
            apollo: this.apollo.getClient(),
          };
          this.store.dispatch(new AuctionRemove(payload));
          return of(auction);
        }),
      );
    return this.loadingService.auto(observable, 'auction-process');
  }
}
