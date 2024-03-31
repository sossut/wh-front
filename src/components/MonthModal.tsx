import React from 'react';
import { MonthsHours } from '../intefaces/MonthsHours';

export interface MonthModalProps {
  onClose: () => void;
  monthsHours: MonthsHours;
  // stateChanger: (
  //   updateFunction: (prevMonths: MonthsHours[]) => MonthsHours[]
  // ) => void;
}

const MonthModal: React.FC<MonthModalProps> = ({ onClose, monthsHours }) => {
  monthsHours.daysHours?.sort((a, b) => {
    if (a.day && b.day) {
      return new Date(a.day).getTime() - new Date(b.day).getTime();
    }
    return 0;
  });
  return (
    <div className="big-modal">
      <button className="close-button" onClick={onClose}>
        Sulje
      </button>
      <div className="big-modal-header">
        <h3>Kuukauden tunnit</h3>
        <div className="big-modal-header-content">
          <p>
            Alkupäivä:{' '}
            {new Date(monthsHours.startDate).toLocaleDateString('fi-FI')}
          </p>
          <p>
            Loppupäivä:{' '}
            {new Date(monthsHours.endDate).toLocaleDateString('fi-FI')}
          </p>
          <p>
            Työtunnit:{' '}
            {(Number(monthsHours.monthsWorkedHoursSeconds) ?? 0) / 3600}
          </p>
          <p>Kilometrit: {monthsHours.monthsKilometers}</p>
        </div>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>Päivämäärä</th>
              <th>Tunnit</th>
              <th>Kilometrit</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(monthsHours.daysHours) &&
              monthsHours.daysHours.map((dayHours) => {
                const workedHours = (dayHours.hoursSeconds ?? 0) / 3600;
                return (
                  <tr key={dayHours.id}>
                    <td>
                      {(dayHours.day &&
                        new Date(dayHours.day)?.toLocaleDateString('fi-FI')) ??
                        'N/A'}
                    </td>
                    <td>{workedHours}</td>
                    <td>{dayHours.kilometers}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthModal;
