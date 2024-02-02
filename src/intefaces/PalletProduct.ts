import { PalletProps } from '../components/Pallet';
import { Product } from './Product';

export interface PalletProduct {
  id?: number;
  palletId: number | PalletProps;
  productId: number | Product;
  quantity: number;
}
