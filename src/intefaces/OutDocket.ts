import { Client } from './Client';
import { OutDocketProduct } from './OutDocketProduct';
import { TransportOption } from './TransportOption';
import { User } from './User';

export interface OutDocket {
  id: number;
  docketNumber: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number | User;
  clientId: number | Client;
  client: Client;
  status: 'open' | 'closed';
  departureAt: Date | null;
  transportOptionId: number | TransportOption;
  filename: string;
  products?: OutDocketProduct[];
}
