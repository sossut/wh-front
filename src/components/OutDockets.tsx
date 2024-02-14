import React from 'react';

const OutDockets = () => {
  return (
    <div className="dockets-body">
      <header className="dockets-header">
        <h1>Lähteneet</h1>
        <div>
          <input type="text" placeholder="Hae"></input>
          <button>Hae</button>
        </div>
        <div>
          <button>Lisää lähete</button>
        </div>
      </header>
      <div>
        <table className="dockets-table">
          <thead className="dockets-thead">
            <tr>
              <th>Lähetenumero</th>
              <th>Lähetyspäivä</th>
              <th>Toimitusosoite</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>12.12.2020</td>
              <td>Osoite 1</td>
              <td>
                <button>Muokkaa</button>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>12.12.2020</td>
              <td>Osoite 2</td>
              <td>
                <button>Muokkaa</button>
              </td>
            </tr>
            <tr>
              <td>3</td>
              <td>12.12.2020</td>
              <td>Osoite 3</td>
              <td>
                <button>Muokkaa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OutDockets;
