import React from 'react';
import { DaysHours } from '../intefaces/DaysHours';
import { useDaysHours } from '../hooks/ApiHooks';
import { MonthsHours } from '../intefaces/MonthsHours';
import Months from '../components/Months';

const Hours = () => {
  const [daysHours, setDaysHours] = React.useState<DaysHours[]>([]);
  const [newDaysHours, setNewDaysHours] = React.useState<DaysHours>(
    {} as DaysHours
  );
  const {
    getDaysHoursList,
    getDaysHours,
    postDaysHours,
    getMonthsHoursList,
    deleteDaysHours
  } = useDaysHours();
  const [daysHoursSingle, setDaysHoursSingle] = React.useState<DaysHours>(
    {} as DaysHours
  );
  const [monthsHours, setMonthsHours] = React.useState<MonthsHours[]>([]);
  const edit = (daysHoursSingle: DaysHours) => {
    console.log('edit');
    setDaysHoursSingle(daysHoursSingle);
  };

  const handleNewDaysHours = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if ((newDaysHours.workedHours ?? 0) <= 0) {
        alert('Tuntien määrä ei voi olla nolla tai negatiivinen');
        return;
      }

      const abc: DaysHours = {
        day: newDaysHours.day,
        workedHoursSeconds: (Number(newDaysHours.workedHours) ?? 0) * 3600,
        kilometers: newDaysHours.kilometers ?? 0
      };
      if (
        isNaN(abc.workedHoursSeconds as number) ||
        (abc.workedHoursSeconds as number) <= 0
      ) {
        alert('Tuntien määrä ei voi olla nolla tai negatiivinen');
        return;
      }
      const ndh = await postDaysHours(abc);
      const getNewDaysHours = await getDaysHours(ndh.id as number);
      console.log(newDaysHours);
      if (ndh && getNewDaysHours) {
        const updatedDaysHours = [...daysHours, getNewDaysHours];
        updatedDaysHours.sort(
          (a, b) => new Date(b.day).getTime() - new Date(a.day).getTime()
        );
        setDaysHours(updatedDaysHours);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteDaysHours = async (id: number) => {
    if (!window.confirm('Haluatko varmasti poistaa tunnit?')) {
      return;
    }

    const deleted = await deleteDaysHours(id);
    if (deleted) {
      const updatedDaysHours = daysHours.filter((dh) => dh.id !== id);
      setDaysHours(updatedDaysHours);
    }
  };

  const updateMonthsHoursState = (
    updateFunction: (monthsHours: MonthsHours[]) => MonthsHours[]
  ) => {
    setMonthsHours((prevMonthsHours) => updateFunction(prevMonthsHours));
  };

  React.useEffect(() => {
    (async () => {
      const daysHoursList = await getDaysHoursList();
      console.log(daysHoursList);
      Array.isArray(daysHoursList) &&
        setDaysHours(
          daysHoursList.sort(
            (a, b) => new Date(b.day).getTime() - new Date(a.day).getTime()
          )
        );
      const monthsHoursList = await getMonthsHoursList();
      Array.isArray(monthsHoursList) &&
        setMonthsHours(
          monthsHoursList.sort(
            (a, b) =>
              new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          )
        );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <main className="dockets hours-and-months">
        <div>
          <h1>Tunnit</h1>
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(daysHours) &&
                daysHours.map((dayHours) => {
                  const workedHours = (dayHours.workedHoursSeconds ?? 0) / 3600;
                  return (
                    <tr key={dayHours.id}>
                      <td>
                        {new Date(dayHours.day).toLocaleDateString('fi-FI')}
                      </td>
                      <td>{workedHours}</td>
                      <td>{dayHours.kilometers}</td>
                      <td>
                        <button onClick={() => edit(dayHours)}>Muokkaa</button>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteDaysHours(dayHours.id as number)
                          }
                        >
                          Poista
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <Months
          monthsHours={monthsHours}
          updateMonthsHoursState={updateMonthsHoursState}
        />
      </main>
    </div>
  );
};

export default Hours;
