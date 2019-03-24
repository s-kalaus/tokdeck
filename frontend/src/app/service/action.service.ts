import { Injectable } from '@angular/core';
import { FluxStandardAction } from 'flux-standard-action';
import { Auction, Product, Customer, Token } from '@app/interface';
import { Apollo } from 'apollo-angular';
import { LoadingService } from '@app/service/loading.service';
import { LayoutService } from '@app/service/layout.service';

type Payload = any;
type MetaData = any;
export type TokdeckAction = FluxStandardAction<Payload, MetaData>;

@Injectable({
  providedIn: 'root',
})
export class ActionService {
  static AUCTION_ALL = 'AUCTION_ALL';
  static AUCTION_ONE = 'AUCTION_ONE';
  static AUCTION_ADD = 'AUCTION_ADD';
  static AUCTION_REMOVE = 'AUCTION_REMOVE';
  static PRODUCT_ALL = 'PRODUCT_ALL';
  static PRODUCT_ONE = 'PRODUCT_ONE';
  static PRODUCT_ADD = 'PRODUCT_ADD';
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

  auctionOne = (apollo, auction: Auction): TokdeckAction => ({
    type: ActionService.AUCTION_ONE,
    meta: { apollo },
    payload: auction,
  })

  auctionAdd = (apollo, auction: Auction): TokdeckAction => ({
    type: ActionService.AUCTION_ADD,
    meta: { apollo },
    payload: auction,
  })

  auctionRemove = (apollo, auction: Auction): TokdeckAction => ({
    type: ActionService.AUCTION_REMOVE,
    meta: { auction, apollo },
  })

  productAll = (auctionId: string, products: Product[]): TokdeckAction => ({
    type: ActionService.PRODUCT_ALL,
    meta: { auctionId },
    payload: products,
  })

  productOne = (apollo, product: Product): TokdeckAction => ({
    type: ActionService.PRODUCT_ONE,
    meta: { apollo },
    payload: product,
  })

  productAdd = (apollo, product: Product): TokdeckAction => ({
    type: ActionService.PRODUCT_ADD,
    meta: { apollo },
    payload: product,
  })

  productRemove = (apollo, product: Product): TokdeckAction => ({
    type: ActionService.PRODUCT_REMOVE,
    meta: { product, apollo },
  })
}
