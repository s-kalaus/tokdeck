import { Action } from 'redux';
import { ActionService, TokdeckAction } from '@app/service/action.service';
import { Auction, Customer, Product, Token } from '@app/interface';

export interface IAppState {
  auctionAll: Auction[];
  auctionOne: {
    [auctionId: string]: Auction,
  };
  productAll: {
    [auctionId: string]: Product[],
  };
  productOne: {
    [productId: string]: Product,
  };
  token: Token;
  customer: Customer | null;
}

export const INITIAL_STATE: IAppState = {
  auctionAll: [],
  auctionOne: {},
  productAll: {},
  productOne: {},
  token: null,
  customer: null,
};

export function rootReducer(lastState: IAppState, action: TokdeckAction): IAppState {
  switch (action.type) {
    case ActionService.TOKEN_SET:
      return {
        ...lastState,
        token: action.payload,
      };
    case ActionService.CUSTOMER_SET:
      return {
        ...lastState,
        customer: action.payload,
      };
    case ActionService.AUCTION_ALL:
      return {
        ...lastState,
        auctionAll: action.payload,
      };
    case ActionService.AUCTION_ONE:
      return {
        ...lastState,
        auctionOne: { ...lastState.auctionOne, [action.meta.auctionId]: action.payload },
      };
    case ActionService.AUCTION_REMOVE:
      return {
        ...lastState,
        auctionOne: Object.keys(lastState.auctionOne).reduce(
          (auctionOne, key) => ({
            ...auctionOne,
            ...(lastState.auctionOne[key].auctionId === action.meta.auctionId
              ? {}
              : { [key]: lastState.auctionOne[key] }
            ),
          }),
          {},
        ),
      };
    case ActionService.PRODUCT_ALL:
      return {
        ...lastState,
        productAll: { ...lastState.productAll, [action.meta.auctionId]: action.payload },
      };
    case ActionService.PRODUCT_ONE:
      return {
        ...lastState,
        productOne: { ...lastState.productOne, [action.meta.productId]: action.payload },
      };
    case ActionService.PRODUCT_REMOVE:
      return {
        ...lastState,
        productOne: Object.keys(lastState.productOne).reduce(
          (productOne, key) => ({
            ...productOne,
            ...(lastState.productOne[key].productId === action.meta.productId
                ? {}
                : { [key]: lastState.productOne[key] }
            ),
          }),
          {},
        ),
      };
  }

  return lastState;
}
