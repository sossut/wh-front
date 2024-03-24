import { Product } from './Product';
import { QuantityOption } from './QuantityOption';

export interface InDocketProduct {
  id?: number;
  inDocketId?: number;
  productId: number | Product;
  orderedProductQuantity: number;
  receivedProductQuantity: number;
  name: string;
  code: string;
  quantityOption: QuantityOption;
}
