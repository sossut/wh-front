import { QuantityOption } from "./QuantityOption";

export interface Product {
  id: number;
  name: string;
  code: string;
  weight: number;
  quantity: number;
  quantityOptionId: number | QuantityOption;
}
