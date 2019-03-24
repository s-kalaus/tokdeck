import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { Product } from '@app/interface';
import { switchMap, first } from 'rxjs/operators';
import { productFetchAll, productFetchOne, productRemove, productUpdate } from '@app/mutation';
import { productAdd } from '@app/mutation/product-add';
import { LoadingService } from '@app/service/loading.service';
import { ActionService } from '@app/service/action.service';
import { dispatch } from '@angular-redux/store';
import { LayoutService } from '@app/service/layout.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  @dispatch() productAll = (auctionId, products) =>
    this.actionService.productAll(auctionId, products)
  @dispatch() productOne = product =>
    this.actionService.productOne(this.apollo.getClient(), product)
  @dispatch() productAdd = product =>
    this.actionService.productAdd(this.apollo.getClient(), product)
  @dispatch() productRemove = product =>
    this.actionService.productRemove(this.apollo.getClient(), product)

  constructor(
    private apollo: Apollo,
    private loadingService: LoadingService,
    private actionService: ActionService,
    public layoutService: LayoutService,
  ) {
  }

  fetchAll(auctionId: string): Observable<any> {
    const observable = this.apollo
      .query({
        query: productFetchAll,
        variables: {
          auctionId,
        },
      })
      .pipe(
        first(),
        switchMap((result: any) => {
          this.productAll(auctionId, result.data.products);
          return of(result.data.products);
        }),
      );
    return this.loadingService.auto(observable, 'product-list');
  }

  fetchOne(productId: string): Observable<any> {
    const observable = this.apollo
      .query({
        query: productFetchOne,
        variables: {
          productId,
        },
      })
      .pipe(
        first(),
        switchMap((result: any) => {
          this.productOne(result.data.product);
          return of(result.data.product);
        }),
      );
    return this.loadingService.auto(observable, 'product-detail');
  }

  add({ auctionId, oid }): Observable<any> {
    const observable = this.apollo
      .mutate({
        mutation: productAdd,
        variables: {
          auctionId,
          oid,
        },
      })
      .pipe(
        first(),
        switchMap((result) => {
          this.productAdd(result.data.productAdd.product);
          return of(result.data.productAdd.product);
        }),
      );
    return this.loadingService.auto(observable, 'product-process');
  }

  update(productId): Observable<any> {
    const observable = this.apollo
      .mutate({
        mutation: productUpdate,
        variables: {
          productId,
        },
      })
      .pipe(
        first(),
        switchMap((result) => {
          this.productOne(result.data.productUpdate.product);
          return of(result.data.productUpdate.product);
        }),
      );
    return this.loadingService.auto(observable, 'product-process');
  }

  remove(product: Product): Observable<any> {
    const observable = this.apollo
      .mutate({
        mutation: productRemove,
        variables: {
          productId: product.productId,
        },
      })
      .pipe(
        first(),
        switchMap(() => {
          this.productRemove(product);
          return of(product);
        }),
      );
    return this.loadingService.auto(observable, 'product-process');
  }
}
