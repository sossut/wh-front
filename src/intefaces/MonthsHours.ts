import { MonthsHoursDaysHours } from './MonthsHoursDaysHours';

export interface MonthsHours {
  id?: number;
  startDate: Date;
  endDate: Date;
  monthsWorkedHoursSeconds?: number;
  daysHours?: MonthsHoursDaysHours[];
  monthsKilometers?: number;
}
