import { Auction } from '@app/interface/auction';

export interface AuctionState {
  auctionAll: Auction[];
  auctionOne: {
    [key: string]: Auction,
  };
}
