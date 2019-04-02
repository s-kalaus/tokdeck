import {
  createSelector,
  createFeatureSelector,
} from '@ngrx/store';
import { productAll, productMap, ProductState } from '@app/reducer/product.reducer';

export const selectProductState = createFeatureSelector<ProductState>('product');

export const selectProductAll = createSelector(
  selectProductState,
  productAll,
);

export const selectProductMap = createSelector(
  selectProductState,
  productMap,
);

export const selectProductOne = createSelector(
  selectProductMap,
  (entities, { productId }) => entities[productId],
);
