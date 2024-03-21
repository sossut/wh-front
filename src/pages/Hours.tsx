import React from 'react';
import { DaysHours } from '../intefaces/DaysHours';

const Hours = () => {
  const [daysHours, setDaysHours] = React.useState<DaysHours[]>([]);
  const [newDaysHours, setNewDaysHours] = React.useState<DaysHours>({
    day: new Date(),
    workedHours: 0,
    kilometers: 0
  });
  const [daysHoursSingle, setDaysHoursSingle] = React.useState<DaysHours>(
    {} as DaysHours
  );

  const edit =
    (daysHoursSingle: DaysHours) =>
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      console.log('edit');
      setDaysHoursSingle(daysHoursSingle);
    };

  const handleNewDaysHours = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedDaysHours = [...daysHours, newDaysHours];
    updatedDaysHours.sort((a, b) => b.day.getTime() - a.day.getTime());
    setDaysHours(updatedDaysHours);
    setNewDaysHours({
      day: new Date(),
      workedHours: 0,
      kilometers: 0
    });
  };

  React.useEffect(() => {
    setDaysHours(
      [
        {
          day: new Date('2021-01-01'),
          workedHours: 8
        },
        {
          day: new Date('2021-01-02'),
          workedHours: 8
        },
        {
          day: new Date('2021-01-03'),
          workedHours: 8
        }
      ].sort((a, b) => b.day.getTime() - a.day.getTime())
    );
  }, []);

  return (
    <div>
      <h1>Tunnit</h1>
      <main>
        <div>
          <form onSubmit={handleNewDaysHours}>
            <div>
              <label>Päivämäärä</label>
              <input
                type="date"
                onChange={(e) =>
                  setNewDaysHours({
                    ...newDaysHours,
                    day: new Date(e.target.value)
                  })
                }
              />
            </div>
            <div>
              <label>Tunnit</label>
              <input
                type="number"
                onChange={(e) =>
                  setNewDaysHours({
                    ...newDaysHours,
                    workedHours: parseInt(e.target.value)
                  })
                }
              />
            </div>
            <div>
              <label>Kilometrit</label>
              <input
                type="number"
                onChange={(e) =>
                  setNewDaysHours({
                    ...newDaysHours,
                    kilometers: parseInt(e.target.value)
                  })
                }
              />
            </div>
            <div>
              <button type="submit">Lisää</button>
            </div>
          </form>
        </div>
        <table>
          <thead>
            <tr>
              <th>Päivämäärä</th>
              <th>Tunnit</th>
              <th>Kilometrit</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(daysHours) &&
              daysHours.map((dayHours) => {
                return (
                  <tr key={dayHours.day.getTime()}>
                    <td>{dayHours.day.toLocaleDateString('fi-FI')}</td>
                    <td>{dayHours.workedHours}</td>
                    <td>{dayHours.kilometers}</td>
                    <td>
                      <button onClick={() => edit(dayHours)}>Muokkaa</button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default Hours;
