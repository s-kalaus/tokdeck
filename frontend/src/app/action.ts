import { Action } from '@ngrx/store';
import { Auction, Customer, Product, Token } from '@app/interface';
import { ApolloClient } from 'apollo-client';

export enum ActionTypes {
  AuctionAll = 'AUCTION_ALL',
  AuctionOne = 'AUCTION_ONE',
  AuctionAdd = 'AUCTION_ADD',
  AuctionRemove = 'AUCTION_REMOVE',
  ProductAll = 'PRODUCT_ALL',
  ProductOne = 'PRODUCT_ONE',
  ProductAdd = 'PRODUCT_ADD',
  ProductRemove = 'PRODUCT_REMOVE',
  TokenSet = 'TOKEN_SET',
  CustomerSet = 'CUSTOMER_SET',
}

export class AuctionAll implements Action {
  readonly type = ActionTypes.AuctionAll;
  constructor(public payload: { auctions: Auction[] }) {}
}

export class AuctionOne implements Action {
  readonly type = ActionTypes.AuctionOne;
  constructor(public payload: { auction: Auction, apollo: ApolloClient<any> }) {}
}

export class AuctionAdd implements Action {
  readonly type = ActionTypes.AuctionAdd;
  constructor(public payload: { auction: Auction, apollo: ApolloClient<any> }) {}
}

export class AuctionRemove implements Action {
  readonly type = ActionTypes.AuctionRemove;
  constructor(public payload: { auction: Auction, apollo: ApolloClient<any> }) {}
}

export class ProductAll implements Action {
  readonly type = ActionTypes.ProductAll;
  constructor(public payload: { products: Product[], auctionId: string }) {}
}

export class ProductOne implements Action {
  readonly type = ActionTypes.ProductOne;
  constructor(public payload: { product: Product, apollo: ApolloClient<any> }) {}
}

export class ProductAdd implements Action {
  readonly type = ActionTypes.ProductAdd;
  constructor(public payload: { product: Product, apollo: ApolloClient<any> }) {}
}

export class ProductRemove implements Action {
  readonly type = ActionTypes.ProductRemove;
  constructor(public payload: { product: Product, apollo: ApolloClient<any> }) {}
}

export class TokenSet implements Action {
  readonly type = ActionTypes.TokenSet;
  constructor(public payload: { token: Token | null }) {}
}

export class CustomerSet implements Action {
  readonly type = ActionTypes.CustomerSet;
  constructor(public payload: { customer: Customer | null }) {}
}

export type ActionsUnion =
  AuctionAll |
  AuctionOne |
  AuctionAdd |
  AuctionRemove |
  ProductAll |
  ProductOne |
  ProductAdd |
  ProductRemove |
  TokenSet |
  CustomerSet;
