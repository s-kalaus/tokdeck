import { Product } from '@app/interface/product';

export interface ProductState {
  productAll: Product[];
  productOne: {
    [key: string]: Product,
  };
}
