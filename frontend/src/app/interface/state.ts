import { Auction } from '@app/interface/auction';
import { Product } from '@app/interface/product';
import { Token } from '@app/interface/token';
import { Customer } from '@app/interface/customer';

export interface State {
  auctionAll: Auction[];
  auctionOne: {
    [key: string]: Auction,
  };
  productAll: Product[];
  productOne: {
    [key: string]: Product,
  };
  token: null | Token;
  customer: null | Customer;
}
