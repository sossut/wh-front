import React from 'react';
import { MonthsHours } from '../intefaces/MonthsHours';
import { useDaysHours } from '../hooks/ApiHooks';
import MonthModal from './MonthModal';

export interface MonthsProps {
  updateMonthsHoursState: (
    updateFunction: (monthsHours: MonthsHours[]) => MonthsHours[]
  ) => void;
  monthsHours: MonthsHours[];
}
const Months: React.FC<MonthsProps> = ({
  monthsHours,
  updateMonthsHoursState
}) => {
  const [newMonthsHours, setNewMonthsHours] = React.useState<MonthsHours>(
    {} as MonthsHours
  );
  const [monthsHoursSingle, setMonthsHoursSingle] = React.useState<MonthsHours>(
    {} as MonthsHours
  );
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const { postMonthsHours, getMonthsHours } = useDaysHours();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const abc: MonthsHours = {
        startDate: newMonthsHours.startDate,
        endDate: newMonthsHours.endDate
      };
      const nmh = await postMonthsHours(abc);
      const getNewMonthsHours = await getMonthsHours(nmh.id as number);
      if (nmh && getNewMonthsHours) {
        const updatedMonthsHours = [...monthsHours, getNewMonthsHours];
        updatedMonthsHours.sort(
          (a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        updateMonthsHoursState(() => updatedMonthsHours);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const openModal = (monthsHours: MonthsHours) => {
    setIsModalOpen(true);
    setMonthsHoursSingle(monthsHours);
  };
  console.log(monthsHours);
  return (
    <div>
      <h1>Kuukaudet</h1>
      <main>
        <div>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Alkupäivä</label>
              <input
                type="date"
                onChange={(e) =>
                  setNewMonthsHours({
                    ...newMonthsHours,
                    startDate: new Date(e.target.value)
                  })
                }
              />
            </div>
            <div>
              <label>Loppupäivä</label>
              <input
                type="date"
                onChange={(e) =>
                  setNewMonthsHours({
                    ...newMonthsHours,
                    endDate: new Date(e.target.value)
                  })
                }
              />
            </div>
            <button type="submit">Lisää kuukausi</button>
          </form>
        </div>
        <table>
          <thead>
            <tr>
              <th>Alkupäivä</th>
              <th>Loppupäivä</th>
              <th>Tunnit</th>
              <th>Kilometrit</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(monthsHours) &&
              monthsHours.map((monthsHour) => (
                <tr key={monthsHour.id}>
                  <td>
                    {new Date(monthsHour.startDate).toLocaleDateString('fi-FI')}
                  </td>
                  <td>
                    {new Date(monthsHour.endDate).toLocaleDateString('fi-FI')}
                  </td>
                  <td>
                    {monthsHour.monthsWorkedHoursSeconds
                      ? monthsHour.monthsWorkedHoursSeconds / 3600
                      : 0}
                  </td>
                  <td>{monthsHour.monthsKilometers ?? 0}</td>
                  <td>
                    <button onClick={() => openModal(monthsHour)}>Katso</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </main>
      {isModalOpen && (
        <MonthModal
          onClose={() => setIsModalOpen(false)}
          monthsHours={monthsHoursSingle}
        />
      )}
    </div>
  );
};

export default Months;
