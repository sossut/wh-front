import { Client } from './Client';
import { OutDocketProduct } from './OutDocketProduct';
import { TransportOption } from './TransportOption';
import { User } from './User';

export interface OutDocket {
  id?: number;
  docketNumber: string;
  createdAt?: Date;
  updatedAt: Date;
  userId?: number | User | null;
  clientId?: number | Client | null;
  client?: Client | null;
  status: 'open' | 'closed';
  departureAt: Date | null | string;
  transportOptionId: number | TransportOption | null;
  transportOption?: TransportOption;
  filename?: string;
  products?: OutDocketProduct[];
  outDocketId?: number;
}
