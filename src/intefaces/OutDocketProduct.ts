import { OutDocket } from './OutDocket';
import { Product } from './Product';

export interface OutDocketProduct {
  id?: number;
  outDocketId: number | OutDocket;
  productId: number | Product;
  orderedProductQuantity: number;
  deliveredProductQuantity: number;
}
