import React from 'react';
import { DaysHours } from '../intefaces/DaysHours';

const Hours = () => {
  const [daysHours, setDaysHours] = React.useState<DaysHours[]>([]);
  const sortedDaysHours = daysHours.sort((a, b) => {
    return b.day.getTime() - a.day.getTime();
  });

  return (
    <div>
      <h1>Tunnit</h1>
      <main>
        <div>
          <form>
            <div>
              <input type="date" />
            </div>
            <div>
              <input type="number" />
            </div>
            <div>
              <input type="number" />
            </div>
            <div>
              <button>Lisää</button>
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
            <tr>
              <td>2021-01-01</td>
              <td>8</td>
              <td></td>
              <td>
                <button>Muokkaa</button>
              </td>
            </tr>
            <tr>
              <td>2021-01-02</td>
              <td>8</td>
              <td></td>
              <td>
                <button>Muokkaa</button>
              </td>
            </tr>
            <tr>
              <td>2021-01-03</td>
              <td>8</td>
              <td></td>
              <td>
                <button>Muokkaa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default Hours;
