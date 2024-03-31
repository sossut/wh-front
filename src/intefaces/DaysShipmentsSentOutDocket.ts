import { OutDocket } from './OutDocket';
import { DaysShipments } from './DaysShipments';
import { SentOutDocket } from './SentOutDocket';

export interface DaysShipmentsSentOutDocket {
  id?: number;
  daysShipmentsId?: number | DaysShipments;
  sentOutDocketId: number | SentOutDocket;
  sentOutDocket?: {
    sentOutDocketId: number;
    outDocket?: OutDocket;
  };
}
