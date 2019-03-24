import { ActionService, TokdeckAction } from '@app/service/action.service';
import { Auction, Customer, Product, Token } from '@app/interface';
import { auctionFetchAll, auctionFetchOne, productFetchAll, productFetchOne } from '@app/mutation';

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
        customer: { ...action.payload },
      };
    case ActionService.AUCTION_ALL:
      return {
        ...lastState,
        auctionAll: [...action.payload],
      };
    case ActionService.AUCTION_ADD:
      const auctionNew = { ...action.payload };
      const auctionAllAdd = [...lastState.auctionAll];
      auctionAllAdd.push(auctionNew);
      action.meta.apollo.writeQuery({
        query: auctionFetchOne,
        variables: {
          auctionId: auctionNew.auctionId,
        },
        data: {
          auction: auctionNew,
        },
      });
      action.meta.apollo.writeQuery({
        query: auctionFetchAll,
        data: {
          auctions: auctionAllAdd,
        },
      });
      return {
        ...lastState,
        auctionAll: auctionAllAdd,
        auctionOne: { ...lastState.auctionOne, [auctionNew.auctionId]: auctionNew },
      };
    case ActionService.AUCTION_ONE:
      const auctionOne = { ...action.payload };
      const auctionAllOne = [...lastState.auctionAll];
      const indexAuctionOne = auctionAllOne
        .findIndex(theAuction => auctionOne.auctionId === theAuction.auctionId);
      if (indexAuctionOne !== -1) {
        auctionAllOne.splice(indexAuctionOne, 1, auctionOne);
        action.meta.apollo.writeQuery({
          query: auctionFetchOne,
          variables: {
            auctionId: auctionOne.auctionId,
          },
          data: {
            auction: auctionOne,
          },
        });
        action.meta.apollo.writeQuery({
          query: auctionFetchAll,
          data: {
            auctions: auctionAllOne,
          },
        });
      }
      return {
        ...lastState,
        auctionAll: auctionAllOne,
        auctionOne: { ...lastState.auctionOne, [auctionOne.auctionId]: { ...auctionOne } },
      };
    case ActionService.AUCTION_REMOVE:
      const auctionRemove = action.meta.auction;
      const auctionAllRemove = [...lastState.auctionAll];
      const indexAuctionRemove = auctionAllRemove
        .findIndex(theAuction => auctionRemove.auctionId === theAuction.auctionId);
      if (indexAuctionRemove !== -1) {
        auctionAllRemove.splice(indexAuctionRemove, 1);
        action.meta.apollo.writeQuery({
          query: auctionFetchAll,
          data: {
            auctions: auctionAllRemove,
          },
        });
      }
      return {
        ...lastState,
        auctionAll: auctionAllRemove,
      };
    case ActionService.PRODUCT_ALL:
      return {
        ...lastState,
        productAll: { ...lastState.productAll, [action.meta.auctionId]: [...action.payload] },
      };
    case ActionService.PRODUCT_ONE:
      const productOne = { ...action.payload };
      const productAllOne = [...lastState.productAll[productOne.auctionId]];
      const indexProductOne = productAllOne
        .findIndex(theProduct => productOne.productId === theProduct.productId);
      if (indexProductOne !== -1) {
        productAllOne.splice(indexProductOne, 1, productOne);
        action.meta.apollo.writeQuery({
          query: productFetchOne,
          variables: {
            productId: productOne.productId,
          },
          data: {
            product: productOne,
          },
        });
        action.meta.apollo.writeQuery({
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
        ...lastState,
        productAll: { ...lastState.productAll, [productOne.auctionId]: productAllOne },
        productOne: { ...lastState.productOne, [productOne.productId]: productOne },
      };
    case ActionService.PRODUCT_ADD:
      const productNew = { ...action.payload };
      const productAllAdd = [...lastState.productAll[productNew.auctionId]];
      productAllAdd.push(productNew);
      action.meta.apollo.writeQuery({
        query: productFetchOne,
        variables: {
          productId: productNew.productId,
        },
        data: {
          product: productNew,
        },
      });
      action.meta.apollo.writeQuery({
        query: productFetchAll,
        variables: {
          auctionId: productNew.auctionId,
        },
        data: {
          products: productAllAdd,
        },
      });
      return {
        ...lastState,
        productAll: { ...lastState.productAll, [productNew.auctionId]: productAllAdd },
        productOne: { ...lastState.productOne, [productNew.productId]: productNew },
      };
    case ActionService.PRODUCT_REMOVE:
      const productRemove = action.meta.product;
      const productAllRemove = [...lastState.productAll[productRemove.auctionId]];
      const indexProductRemove = productAllRemove
        .findIndex(theProduct => productRemove.productId === theProduct.productId);
      if (indexProductRemove !== -1) {
        productAllRemove.splice(indexProductRemove, 1);
        action.meta.apollo.writeQuery({
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
        ...lastState,
        productAll: { ...lastState.productAll, [productRemove.auctionId]: productAllRemove },
      };
  }

  return lastState;
}
