import {
  ActionsUnion,
  AuctionActionTypes,
  AuctionAdd,
  AuctionAll,
  AuctionOne,
  AuctionRemove,
} from '../action/auction.action';
import { auctionFetchAll, auctionFetchOne } from '@app/mutation';
import { AuctionState } from '@app/interface';

export const initialState: AuctionState = {
  auctionAll: [],
  auctionOne: {},
};

export function auctionReducer(
  state = initialState,
  action: ActionsUnion,
): AuctionState {
  switch (action.type) {
    case AuctionActionTypes.AuctionAll: {
      const payload = (action as AuctionAll).payload;
      return {
        ...state,
        auctionAll: [...payload.auctions],
      };
    }
    case AuctionActionTypes.AuctionAdd: {
      const payload = (action as AuctionAdd).payload;
      const auctionNew = { ...payload.auction };
      const auctionAllAdd = [...state.auctionAll];
      auctionAllAdd.push(auctionNew);
      payload.apollo.writeQuery({
        query: auctionFetchOne,
        variables: {
          auctionId: auctionNew.auctionId,
        },
        data: {
          auction: auctionNew,
        },
      });
      payload.apollo.writeQuery({
        query: auctionFetchAll,
        data: {
          auctions: auctionAllAdd,
        },
      });
      return {
        ...state,
        auctionAll: auctionAllAdd,
        auctionOne: { ...state.auctionOne, [auctionNew.auctionId]: auctionNew },
      };
    }
    case AuctionActionTypes.AuctionOne: {
      const payload = (action as AuctionOne).payload;
      const auctionOne = { ...payload.auction };
      const auctionAllOne = [...state.auctionAll];
      const indexAuctionOne = auctionAllOne
        .findIndex(theAuction => auctionOne.auctionId === theAuction.auctionId);
      if (indexAuctionOne !== -1) {
        auctionAllOne.splice(indexAuctionOne, 1, auctionOne);
        payload.apollo.writeQuery({
          query: auctionFetchOne,
          variables: {
            auctionId: auctionOne.auctionId,
          },
          data: {
            auction: auctionOne,
          },
        });
        payload.apollo.writeQuery({
          query: auctionFetchAll,
          data: {
            auctions: auctionAllOne,
          },
        });
      }
      return {
        ...state,
        auctionAll: auctionAllOne,
        auctionOne: { ...state.auctionOne, [auctionOne.auctionId]: { ...auctionOne } },
      };
    }
    case AuctionActionTypes.AuctionRemove: {
      const payload = (action as AuctionRemove).payload;
      const auctionRemove = payload.auction;
      const auctionAllRemove = [...state.auctionAll];
      const indexAuctionRemove = auctionAllRemove
        .findIndex(theAuction => auctionRemove.auctionId === theAuction.auctionId);
      if (indexAuctionRemove !== -1) {
        auctionAllRemove.splice(indexAuctionRemove, 1);
        payload.apollo.writeQuery({
          query: auctionFetchAll,
          data: {
            auctions: auctionAllRemove,
          },
        });
      }
      return {
        ...state,
        auctionAll: auctionAllRemove,
      };
    }
  }

  return state;
}
