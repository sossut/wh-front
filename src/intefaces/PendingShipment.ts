import { Client } from './Client';
import { OutDocket } from './OutDocket';
import { PendingShipmentProduct } from './PendingShipmentProduct';

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
  products: PendingShipmentProduct[];
  client: number | Client;
  outDocket: OutDocket;
  transportOption: TransportOption;
}
