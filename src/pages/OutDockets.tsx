import React from 'react';
import { useOutDockets } from '../hooks/ApiHooks';
import { OutDocket } from '../intefaces/OutDocket';
import { Client } from '../intefaces/Client';
import FullOutDocketModal from '../components/FullOutDocketModal';
import EditOutDocket from '../components/EditOutDocket';

const OutDockets = () => {
  const { getOutDockets } = useOutDockets();
  const [outDockets, setOutDockets] = React.useState<OutDocket[]>([]);
  const [outDocket, setOutDocket] = React.useState<OutDocket | null>(null);
  const [filteredOutDockets, setFilteredOutDockets] =
    React.useState(outDockets);
  const [isFullModalOpen, setIsFullModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  React.useEffect(() => {
    const fetchOutDockets = async () => {
      const outDockets = await getOutDockets();
      setOutDockets(outDockets);
    };
    fetchOutDockets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    sortDockets(outDockets);
    setFilteredOutDockets(outDockets);
  }, [outDockets]);

  const sortDockets = (dockets: OutDocket[]) => {
    if (!Array.isArray(dockets)) {
      console.error(
        'sortDockets was called with a non-array value:',
        dockets
      );
      return [];
    }
    return dockets.sort((a, b) => a.docketNumber.localeCompare(b.docketNumber));
  };

  const editOutDocket = (outDocket: OutDocket) => {
    setOutDocket(outDocket);
    setIsEditModalOpen(true);
  };

  const fullOutDocket = (outDocket: OutDocket) => {
    setIsFullModalOpen(true);
    setOutDocket(outDocket);
  };
  const handleClose = () => {
    setIsFullModalOpen(false);
  };

  const handleState = (
    updateFunction: (prevDockets: OutDocket[]) => OutDocket[]
  ) => {
    setOutDockets(updateFunction);
  };
  return (
    <div className="dockets-body common-body">
      <header className="dockets-header common-header">
        <h1>Lähetteet</h1>
        <div>
          <input type="text" placeholder="Hae"></input>
          <button>Hae</button>
        </div>
        <div>
          <button>Lisää lähete</button>
        </div>
      </header>
      <main>
        <table className="dockets-table common-table">
          <thead className="dockets-thead commont-thead">
            <tr>
              <th>Lähetenumero</th>
              <th>Asiakas</th>
              <th>Toimitusosoite</th>
              <th>Luomispäivä</th>
              <th>Lähetyspäivä</th>
              <th>Tila</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
            Array.isArray(filteredOutDockets) &&
            filteredOutDockets &&
              filteredOutDockets.map((outDocket) => {
                return (
                  <tr key={outDocket.id}>
                    <td>{outDocket.docketNumber}</td>
                    <td>{(outDocket.client as Client).name}</td>
                    <td>Tähän osoite</td>
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
                    <td>{outDocket.status}</td>
                    <td>
                      <button onClick={() => fullOutDocket(outDocket)}>
                        Kerää
                      </button>
                    </td>
                    <td>
                      <button onClick={() => editOutDocket(outDocket)}>
                        Muokkaa
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </main>
      {isFullModalOpen && outDocket && (
        <FullOutDocketModal
          onClose={handleClose}
          outDocket={outDocket}
          stateChanger={handleState}
        ></FullOutDocketModal>
      )}
      {isEditModalOpen && outDocket && (
        <EditOutDocket
          outDocket={outDocket}
          stateChanger={handleState}
          onClose={() => setIsEditModalOpen(false)}
        ></EditOutDocket>
      )}
    </div>
  );
};

export default OutDockets;
