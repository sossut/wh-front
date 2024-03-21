import React from 'react';
// import { useOutDockets } from '../hooks/ApiHooks';
import { OutDocket } from '../intefaces/OutDocket';
import { Client } from '../intefaces/Client';
import FullOutDocketModal from '../components/FullOutDocketModal';
import EditOutDocket from '../components/EditOutDocket';
import AddOutDocketModal from '../components/AddOutDocketModal';
import { PendingShipment } from '../intefaces/PendingShipment';

export interface OutDocketsProps {
  updateState: (
    updateFunction: (prevDockets: PendingShipment[]) => PendingShipment[]
  ) => void;
  outDockets: OutDocket[];
  updateDocketsState: (
    updateFunction: (prevDockets: OutDocket[]) => OutDocket[]
  ) => void;
}

const OutDockets: React.FC<OutDocketsProps> = ({
  updateState,
  outDockets,
  updateDocketsState
}) => {
  // const { getOutDockets } = useOutDockets();
  // const [outDockets, setOutDockets] = React.useState<OutDocket[]>([]);
  const [outDocket, setOutDocket] = React.useState<OutDocket | null>(null);
  const [filteredOutDockets, setFilteredOutDockets] =
    React.useState(outDockets);
  const [isFullModalOpen, setIsFullModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  React.useEffect(() => {
    sortDockets(outDockets);
    setFilteredOutDockets(outDockets);
  }, [outDockets]);

  const sortDockets = (dockets: OutDocket[]) => {
    if (!Array.isArray(dockets)) {
      console.error('sortDockets was called with a non-array value:', dockets);
      return [];
    }
    return dockets.sort((a, b) =>
      b.docketNumber.toString().localeCompare(a.docketNumber.toString())
    );
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

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  // const handleState = (
  //   updateFunction: (prevDockets: OutDocket[]) => OutDocket[]
  // ) => {
  //   setOutDockets(updateFunction);
  // };
  return (
    <div className="dockets-body common-body">
      <header className="dockets-header common-header">
        <h1>Lähetteet</h1>
        <div>
          <input type="text" placeholder="Hae"></input>
          <button>Hae</button>
        </div>
        <div>
          <button
            onClick={() => {
              handleAdd();
            }}
          >
            Lisää lähete
          </button>
        </div>
      </header>
      <main>
        <table className="dockets-table common-table">
          <thead className="dockets-thead commont-thead">
            <tr>
              <th>Lähetenumero</th>
              <th>Asiakas</th>

              <th>Luomispäivä</th>
              <th>Lähetyspäivä</th>
              <th>Tila</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredOutDockets) &&
              filteredOutDockets &&
              filteredOutDockets.map((outDocket) => {
                return (
                  <tr key={outDocket.id}>
                    <td>{outDocket.docketNumber}</td>
                    <td>{(outDocket.client as Client).name}</td>

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
          stateChanger={updateDocketsState}
          updateState={updateState}
        ></FullOutDocketModal>
      )}
      {isEditModalOpen && outDocket && (
        <EditOutDocket
          outDocket={outDocket}
          stateChanger={updateDocketsState}
          onClose={() => setIsEditModalOpen(false)}
        ></EditOutDocket>
      )}
      {isAddModalOpen && (
        <AddOutDocketModal
          stateChanger={updateDocketsState}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </div>
  );
};

export default OutDockets;
