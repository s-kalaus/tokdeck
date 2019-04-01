import { Action } from '@ngrx/store';
import { Auction } from '@app/interface';
import { ApolloClient } from 'apollo-client';

export enum AuctionActionTypes {
  AuctionAll = 'AUCTION_ALL',
  AuctionOne = 'AUCTION_ONE',
  AuctionAdd = 'AUCTION_ADD',
  AuctionRemove = 'AUCTION_REMOVE',
}

export class AuctionAll implements Action {
  readonly type = AuctionActionTypes.AuctionAll;
  constructor(public payload: { auctions: Auction[] }) {}
}

export class AuctionOne implements Action {
  readonly type = AuctionActionTypes.AuctionOne;
  constructor(public payload: { auction: Auction, apollo: ApolloClient<any> }) {}
}

export class AuctionAdd implements Action {
  readonly type = AuctionActionTypes.AuctionAdd;
  constructor(public payload: { auction: Auction, apollo: ApolloClient<any> }) {}
}

export class AuctionRemove implements Action {
  readonly type = AuctionActionTypes.AuctionRemove;
  constructor(public payload: { auction: Auction, apollo: ApolloClient<any> }) {}
}

export type ActionsUnion =
  AuctionAll |
  AuctionOne |
  AuctionAdd |
  AuctionRemove;
