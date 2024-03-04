import { OutDocket } from './OutDocket';
// import { InDocket } from './InDocket';

export interface ProductHistory {
  id: number;
  productId: number;
  quantity: number;
  createdAt: Date;
  outDocketId?: number | OutDocket;
  inDocketId?: number; // | InDocket;
  manual?: 'yes' | 'no';
  outDocketNumber?: string;
  inDocketNumber?: string;
}
