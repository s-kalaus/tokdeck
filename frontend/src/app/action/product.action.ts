import { Action } from '@ngrx/store';
import { Product } from '@app/interface';
import { ApolloClient } from 'apollo-client';

export enum ProductActionTypes {
  ProductAll = 'PRODUCT_ALL',
  ProductOne = 'PRODUCT_ONE',
  ProductAdd = 'PRODUCT_ADD',
  ProductRemove = 'PRODUCT_REMOVE',
}

export class ProductAll implements Action {
  readonly type = ProductActionTypes.ProductAll;
  constructor(public payload: { products: Product[], auctionId: string }) {}
}

export class ProductOne implements Action {
  readonly type = ProductActionTypes.ProductOne;
  constructor(public payload: { product: Product, apollo: ApolloClient<any> }) {}
}

export class ProductAdd implements Action {
  readonly type = ProductActionTypes.ProductAdd;
  constructor(public payload: { product: Product, apollo: ApolloClient<any> }) {}
}

export class ProductRemove implements Action {
  readonly type = ProductActionTypes.ProductRemove;
  constructor(public payload: { product: Product, apollo: ApolloClient<any> }) {}
}

export type ActionsUnion =
  ProductAll |
  ProductOne |
  ProductAdd |
  ProductRemove;
