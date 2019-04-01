import {
  ActionsUnion,
  ActionTypes,
  AuctionAdd,
  AuctionAll,
  AuctionOne,
  AuctionRemove,
  CustomerSet, ProductAdd, ProductAll, ProductOne, ProductRemove,
  TokenSet,
} from './action';
import { auctionFetchAll, auctionFetchOne, productFetchAll, productFetchOne } from '@app/mutation';
import { State } from '@app/interface';

export const initialState: State = {
  auctionAll: [],
  auctionOne: {},
  productAll: [],
  productOne: {},
  token: null,
  customer: null,
};

export function reducer(
  state = initialState,
  action: ActionsUnion,
): State {
  switch (action.type) {
    case ActionTypes.TokenSet: {
      const payload = (action as TokenSet).payload;
      return {
        ...state,
        token: payload.token,
      };
    }
    case ActionTypes.CustomerSet: {
      const payload = (action as CustomerSet).payload;
      return {
        ...state,
        customer: { ...payload.customer },
      };
    }
    case ActionTypes.AuctionAll: {
      const payload = (action as AuctionAll).payload;
      return {
        ...state,
        auctionAll: [...payload.auctions],
      };
    }
    case ActionTypes.AuctionAdd: {
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
    case ActionTypes.AuctionOne: {
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
    case ActionTypes.AuctionRemove: {
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
    case ActionTypes.ProductAll: {
      const payload = (action as ProductAll).payload;
      return {
        ...state,
        productAll: { ...state.productAll, [payload.auctionId]: [...payload.products] },
      };
    }
    case ActionTypes.ProductOne: {
      const payload = (action as ProductOne).payload;
      const productOne = { ...payload.product };
      const productAllOne = [...state.productAll[productOne.auctionId]];
      const indexProductOne = productAllOne
        .findIndex(theProduct => productOne.productId === theProduct.productId);
      if (indexProductOne !== -1) {
        productAllOne.splice(indexProductOne, 1, productOne);
        payload.apollo.writeQuery({
          query: productFetchOne,
          variables: {
            productId: productOne.productId,
          },
          data: {
            product: productOne,
          },
        });
        payload.apollo.writeQuery({
          query: productFetchAll,
          variables: {
            auctionId: productOne.auctionId,
          },
          data: {
            products: productAllOne,
          },
        });
      }
      return {
        ...state,
        productAll: { ...state.productAll, [productOne.auctionId]: productAllOne },
        productOne: { ...state.productOne, [productOne.productId]: productOne },
      };
    }
    case ActionTypes.ProductAdd: {
      const payload = (action as ProductAdd).payload;
      const productNew = { ...payload.product };
      const productAllAdd = [...state.productAll[productNew.auctionId]];
      productAllAdd.push(productNew);
      payload.apollo.writeQuery({
        query: productFetchOne,
        variables: {
          productId: productNew.productId,
        },
        data: {
          product: productNew,
        },
      });
      payload.apollo.writeQuery({
        query: productFetchAll,
        variables: {
          auctionId: productNew.auctionId,
        },
        data: {
          products: productAllAdd,
        },
      });
      return {
        ...state,
        productAll: { ...state.productAll, [productNew.auctionId]: productAllAdd },
        productOne: { ...state.productOne, [productNew.productId]: productNew },
      };
    }
    case ActionTypes.ProductRemove: {
      const payload = (action as ProductRemove).payload;
      const productRemove = payload.product;
      const productAllRemove = [...state.productAll[productRemove.auctionId]];
      const indexProductRemove = productAllRemove
        .findIndex(theProduct => productRemove.productId === theProduct.productId);
      if (indexProductRemove !== -1) {
        productAllRemove.splice(indexProductRemove, 1);
        payload.apollo.writeQuery({
          query: productFetchAll,
          variables: {
            auctionId: productRemove.auctionId,
          },
          data: {
            products: productAllRemove,
          },
        });
      }
      return {
        ...state,
        productAll: { ...state.productAll, [productRemove.auctionId]: productAllRemove },
      };
    }
  }

  return state;
}
