export interface ReceivedInDocketProduct {
  id?: number;
  receivedInDocketId?: number;
  productId: number;
  orderedProductQuantity?: number;
  receivedProductQuantity: number;
  inDocketProductId?: number;
  name: string;
  code: string;
}
