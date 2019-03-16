import { Action } from 'redux';
import { ActionService, TokdeckAction } from '@app/service/action.service';
import { Auction, Customer, Token } from '@app/interface';

export interface IAppState {
  auctionAll: Auction[];
  auctionOne: {
    [auctionId: string]: Auction,
  };
  token: Token;
  customer: Customer | null;
}

export const INITIAL_STATE: IAppState = {
  auctionAll: [],
  auctionOne: {},
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
  }

  return lastState;
}
