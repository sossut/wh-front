import { DaysHours } from './DaysHours';
import { MonthsHours } from './MonthsHours';

export interface MonthsHoursDaysHours {
  id?: number;
  daysHoursId?: number | DaysHours;
  monthHoursId: number | MonthsHours;
  day?: Date;
  workedHoursSeconds?: number;
  hoursSeconds?: number;
  kilometers?: number;
}
