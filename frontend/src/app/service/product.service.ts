import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import graphqlTag from 'graphql-tag';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Product, Customer } from '@app/interface';
import { ApolloQueryResult } from 'apollo-client';
import { catchError, first, map, switchMap, take, tap } from 'rxjs/operators';
import { productFetchAll, productFetchOne, productRemove, productUpdate } from '@app/mutation';
import { productAdd } from '@app/mutation/product-add';
import { LoadingService } from '@app/service/loading.service';
import { ActionService } from '@app/service/action.service';
import { dispatch, select } from '@angular-redux/store';
import { IAppState } from '@app/store';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  @select('productAll') readonly products$: Observable<Product[]>;
  @dispatch() productAll = (auctionId, products) =>
    this.actionService.productAll(auctionId, products)
  @dispatch() productOne = (productId, product) =>
    this.actionService.productOne(productId, product)
  @dispatch() productRemove = productId =>
    this.actionService.productRemove(productId)

  private products: Product[] = [];

  constructor(
    private apollo: Apollo,
    private loadingService: LoadingService,
    private actionService: ActionService,
  ) {
    this.init();
  }

  init() {
    this.products$.subscribe(products => this.products = products);
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
        take(1),
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
        take(1),
        switchMap((result: any) => {
          this.productOne(productId, result.data.product);
          return of(result.data.product);
        }),
      );
    return this.loadingService.auto(observable, 'product-detail');
  }

  remove(productId: string): Observable<any> {
    const observable = this.apollo
      .mutate({
        mutation: productRemove,
        variables: {
          productId,
        },
      })
      .pipe(
        take(1),
        switchMap((result) => {
          this.productRemove(productId);

          const index = this.products.findIndex(product => product.productId === productId);
          if (index !== -1) {
            const product = this.products[index];
            this.products.splice(index, 1);
            this.productAll(product.auctionId, this.products);

            this.apollo.getClient().writeQuery({
              query: productFetchAll,
              data: {
                products: this.products,
              },
            });
          }

          return of(null);
        }),
      );
    return this.loadingService.auto(observable, 'product-process');
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
        take(1),
        switchMap((result) => {
          const product = result.data.productAdd.product as Product;
          this.products.push(product);

          this.productOne(product.productId, product);
          this.productAll(auctionId, this.products);

          this.apollo.getClient().writeQuery({
            query: productFetchOne,
            variables: {
              productId: product.productId,
            },
            data: {
              product,
            },
          });

          this.apollo.getClient().writeQuery({
            query: productFetchAll,
            data: {
              products: this.products,
            },
          });
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
        take(1),
        switchMap((result) => {
          const productUpdated = result.data.productUpdate.product as Product;

          this.productOne(productUpdated.productId, productUpdated);

          const product = this.products
            .find(product => product.productId === productUpdated.productId);

          if (product) {
            Object.assign(product, productUpdated);

            this.productAll(product.auctionId, this.products);

            this.apollo.getClient().writeQuery({
              query: productFetchOne,
              variables: {
                productId,
              },
              data: {
                product: productUpdated,
              },
            });

            this.apollo.getClient().writeQuery({
              query: productFetchAll,
              data: {
                products: this.products,
              },
            });
          }
          return of(result.data.productUpdate.product);
        }),
      );
    return this.loadingService.auto(observable, 'product-process');
  }
}
