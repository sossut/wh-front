import { DaysShipmentsSentOutDocket } from './DaysShipmentsSentOutDocket';

export interface DaysShipments {
  id?: number;
  departedAt: Date;
  sentOutDockets: DaysShipmentsSentOutDocket[];
  json?: string;
}
