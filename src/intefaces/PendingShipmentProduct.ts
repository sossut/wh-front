export interface PendingShipmentProduct {
  id?: number;
  pendingShipmentId?: number;
  productId: number;
  orderedProductQuantity?: number;
  collectedProductQuantity: number;
  outDocketProductId?: number;
  code?: string;
  name?: string;
}
