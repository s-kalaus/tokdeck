import {
  ActionsUnion,
  ProductActionTypes,
  ProductAdd,
  ProductAll,
  ProductOne,
  ProductRemove,
} from '../action/product.action';
import { productFetchAll, productFetchOne } from '@app/mutation';
import { ProductState } from '@app/interface';

export const initialState: ProductState = {
  productAll: [],
  productOne: {},
};

export function productReducer(
  state = initialState,
  action: ActionsUnion,
): ProductState {
  switch (action.type) {
    case ProductActionTypes.ProductAll: {
      const payload = (action as ProductAll).payload;
      return {
        ...state,
        productAll: { ...state.productAll, [payload.auctionId]: [...payload.products] },
      };
    }
    case ProductActionTypes.ProductOne: {
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
    case ProductActionTypes.ProductAdd: {
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
    case ProductActionTypes.ProductRemove: {
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
