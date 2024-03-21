export interface SentOutDocketProduct {
  id?: number;
  sentOutDocketId?: number;
  productId: number;
  orderedProductQuantity?: number;
  deliveredProductQuantity: number;
  outDocketProductId?: number;
  name: string;
  code: string;
}
