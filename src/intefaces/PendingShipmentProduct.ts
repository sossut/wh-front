export interface PendingShipmentProduct {
  id?: number;
  pendingShipmentId: number;
  productId: number;
  orderedProductQuantity?: number;
  deliveredProductQuantity: number;
  outDocketProductId?: number;
}
