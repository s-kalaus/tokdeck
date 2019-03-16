import { Action } from 'redux';
import { ActionService, TokdeckAction } from '@app/service/action.service';
import { Auction } from '@app/interface';

export interface IAppState {
  auctionAll: Auction[];
  auctionOne: {
    [auctionId: string]: Auction,
  };
}

export const INITIAL_STATE: IAppState = {
  auctionAll: [],
  auctionOne: {},
};

export function rootReducer(lastState: IAppState, action: TokdeckAction): IAppState {
  switch (action.type) {
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
