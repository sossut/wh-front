import { QuantityOption } from './QuantityOption';
import { OutDocket } from './OutDocket';
import { Product } from './Product';

export interface OutDocketProduct {
  id?: number;
  outDocketId: number | OutDocket;
  productId: number | Product;
  orderedProductQuantity: number;
  deliveredProductQuantity: number;
  code: string;
  name: string;
  quantityOption: QuantityOption;
  outDocketProductId?: number;
}
