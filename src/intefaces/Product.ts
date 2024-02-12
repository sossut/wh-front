import { QuantityOption } from './QuantityOption';

export interface Product {
  id?: number;
  name: string;
  code: string;
  weight: number;
  quantity: number;
  price: number;
  quantityOptionId: number | QuantityOption;
  productCategoryId: number;
  productSubCategoryId: number;
  updatedAt?: Date;
}
