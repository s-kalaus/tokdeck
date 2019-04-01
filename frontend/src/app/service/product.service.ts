import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { Product } from '@app/interface';
import { switchMap, first } from 'rxjs/operators';
import { productFetchAll, productFetchOne, productRemove, productUpdate } from '@app/mutation';
import { productAdd } from '@app/mutation/product-add';
import { LoadingService } from '@app/service/loading.service';
import { LayoutService } from '@app/service/layout.service';
import { Store } from '@ngrx/store';
import { ProductAdd, ProductAll, ProductOne, ProductRemove } from '@app/action/product.action';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private apollo: Apollo,
    private loadingService: LoadingService,
    public layoutService: LayoutService,
    private store: Store<any>,
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
          const payload = {
            auctionId,
            products: result.data.products,
          };
          this.store.dispatch(new ProductAll(payload));
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
          const payload = {
            product: result.data.product,
            apollo: this.apollo.getClient(),
          };
          this.store.dispatch(new ProductOne(payload));
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
          const payload = {
            product: result.data.productAdd.product,
            apollo: this.apollo.getClient(),
          };
          this.store.dispatch(new ProductAdd(payload));
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
          const payload = {
            product: result.data.productUpdate.product,
            apollo: this.apollo.getClient(),
          };
          this.store.dispatch(new ProductOne(payload));
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
          const payload = {
            product,
            apollo: this.apollo.getClient(),
          };
          this.store.dispatch(new ProductRemove(payload));
          return of(product);
        }),
      );
    return this.loadingService.auto(observable, 'product-process');
  }
}
