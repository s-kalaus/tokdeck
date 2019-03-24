import { Injectable } from '@angular/core';
import { Action } from 'redux';
import { FluxStandardAction } from 'flux-standard-action';
import { Auction, Product, Customer, Token } from '@app/interface';

type Payload = any;
type MetaData = any;
export type TokdeckAction = FluxStandardAction<Payload, MetaData>;

@Injectable({
  providedIn: 'root',
})
export class ActionService {
  static AUCTION_ALL = 'AUCTION_ALL';
  static AUCTION_ONE = 'AUCTION_ONE';
  static AUCTION_REMOVE = 'AUCTION_REMOVE';
  static PRODUCT_ALL = 'PRODUCT_ALL';
  static PRODUCT_ONE = 'PRODUCT_ONE';
  static PRODUCT_REMOVE = 'PRODUCT_REMOVE';
  static TOKEN_SET = 'TOKEN_SET';
  static CUSTOMER_SET = 'CUSTOMER_SET';

  tokenSet = (token: Token | null): TokdeckAction => ({
    type: ActionService.TOKEN_SET,
    payload: token,
  })

  customerSet = (customer: Customer | null): TokdeckAction => ({
    type: ActionService.CUSTOMER_SET,
    payload: customer,
  })

  auctionAll = (auctions: Auction[]): TokdeckAction => ({
    type: ActionService.AUCTION_ALL,
    payload: auctions,
  })

  auctionOne = (auctionId: string, auction: Auction): TokdeckAction => ({
    type: ActionService.AUCTION_ONE,
    meta: { auctionId },
    payload: auction,
  })

  auctionRemove = (auctionId: string): TokdeckAction => ({
    type: ActionService.AUCTION_REMOVE,
    meta: { auctionId },
  })

  productAll = (auctionId: string, products: Product[]): TokdeckAction => ({
    type: ActionService.PRODUCT_ALL,
    meta: { auctionId },
    payload: products,
  })

  productOne = (productId: string, product: Product): TokdeckAction => ({
    type: ActionService.PRODUCT_ONE,
    meta: { productId },
    payload: product,
  })

  productRemove = (productId: string): TokdeckAction => ({
    type: ActionService.PRODUCT_REMOVE,
    meta: { productId },
  })
}
