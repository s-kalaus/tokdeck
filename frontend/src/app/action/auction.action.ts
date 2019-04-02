import { Action } from '@ngrx/store';
import { Auction } from '@app/interface';

export enum AuctionActionTypes {
  AuctionAll = 'AUCTION_ALL',
  AuctionOne = 'AUCTION_ONE',
  AuctionRemove = 'AUCTION_REMOVE',
}

export class AuctionAll implements Action {
  readonly type = AuctionActionTypes.AuctionAll;
  constructor(public payload: { auctions: Auction[] }) {}
}

export class AuctionOne implements Action {
  readonly type = AuctionActionTypes.AuctionOne;
  constructor(public payload: { auction: Auction }) {}
}

export class AuctionRemove implements Action {
  readonly type = AuctionActionTypes.AuctionRemove;
  constructor(public payload: { auction: Auction }) {}
}

export type ActionsUnion =
  AuctionAll |
  AuctionOne |
  AuctionRemove;
