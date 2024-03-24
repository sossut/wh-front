import { InDocketProduct } from './InDocketProduct';
import { Vendor } from './Vendor';

export interface InDocket {
  id?: number;
  docketNumber: string;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: number | null;
  vendorId?: number | null;
  status?: 'open' | 'closed';
  arrivedAt: Date | null;
  vendor: Vendor;
  products: InDocketProduct[];
}
