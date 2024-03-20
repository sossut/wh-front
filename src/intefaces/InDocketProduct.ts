import { Product } from "./Product";
import { QuantityOption } from "./QuantityOption";

export interface InDocketProduct {
    id?: number;
    inDocketId?: number;
    productId: number | Product;
    orderedProductQuantity: number;
    deliveredProductQuantity: number;
    code: string;
  name: string;
  quantityOption: QuantityOption;
}