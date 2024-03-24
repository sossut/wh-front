import { InDocket } from './InDocket';
import { ReceivedInDocketProduct } from './ReceivedInDocketProduct';
import { User } from './User';
import { Vendor } from './Vendor';

export interface ReceivedInDocket {
  id?: number;
  inDocketId: number | InDocket;
  arrivalAt: Date;
  createdAt: Date;
  userId: number | User;
  vendor?: Vendor;
  vendorId: number | Vendor;
  products: ReceivedInDocketProduct[];
}
