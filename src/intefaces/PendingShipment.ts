import { Client } from './Client';
import { OutDocket } from './OutDocket';
import { SentOutDocketProduct } from './SentOutDocketProduct';
import { TransportOption } from './TransportOption';
import { User } from './User';

export interface PendingShipment {
  id: number;
  docketId: number | OutDocket;
  transportOptionId: number | TransportOption;
  userId: number | User;
  createdAt: Date;
  status: 'open' | 'closed';
  parcels: number;
  departureAt: Date;
  products: SentOutDocketProduct[];
  client: number | Client;
  outDocket: OutDocket;
  transportOption: TransportOption;
}
