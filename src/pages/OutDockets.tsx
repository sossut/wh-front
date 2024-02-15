import React from 'react';
import { useOutDockets } from '../hooks/ApiHooks';
import { OutDocket } from '../intefaces/OutDocket';
import { Client } from '../intefaces/Client';

const OutDockets = () => {
  const { getOutDockets } = useOutDockets();
  const [outDockets, setOutDockets] = React.useState<OutDocket[]>([]);

  React.useEffect(() => {
    const fetchOutDockets = async () => {
      const outDockets = await getOutDockets();
      setOutDockets(outDockets);
    };
    fetchOutDockets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="dockets-body common-body">
      <header className="dockets-header common-header">
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
              <th>Luomispäivä</th>
              <th>Lähetyspäivä</th>
              <th>Asiakas</th>
              <th>Toimitusosoite</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {outDockets &&
              outDockets.map((outDocket) => {
                return (
                  <tr key={outDocket.id}>
                    <td>{outDocket.docketNumber}</td>
                    <td>
                      {outDocket.createdAt
                        ? new Date(outDocket.createdAt).toLocaleDateString(
                            'fi-FI'
                          )
                        : 'N/A'}
                    </td>
                    <td>
                      {outDocket.departureAt
                        ? new Date(outDocket.departureAt).toLocaleDateString(
                            'fi-FI'
                          )
                        : 'N/A'}
                    </td>
                    <td>{(outDocket.client as Client).name}</td>
                    <td>Tähän osoite</td>
                    <td>
                      <button>Muokkaa</button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OutDockets;
