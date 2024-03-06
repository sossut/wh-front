import React from 'react';
import { useInDockets } from '../hooks/ApiHooks';
import { InDocket } from '../intefaces/InDocket';
import EditInDocketModal from '../components/EditInDocketModal';
import AddInDocketModal from '../components/AddInDocketModal';

const InDocketsPage = () => {
  const { getInDockets, postInDocket } = useInDockets();
  const [inDockets, setInDockets] = React.useState<InDocket[]>([]);
  const [inDocket, setInDocket] = React.useState<InDocket | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isFullModalOpen, setIsFullModalOpen] = React.useState(false);
  const handleState = (
    updateFunction: (prevDockets: InDocket[]) => InDocket[]
  ) => {
    setInDockets(updateFunction);
  };
  const editInDocket = (inDocket: InDocket) => {
    setInDocket(inDocket);
    setIsEditModalOpen(true);
  };
  React.useEffect(() => {
    (async () => {
      const inDockets = await getInDockets();
      setInDockets(inDockets);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="dockets-body common-body">
      <header className="dockets-header common-header">
        <h1>Saapuneet rahtikirjat</h1>
        <div>
          <input type="text" placeholder="Hae"></input>
          <button>Hae</button>
        </div>

        <button onClick={() => setIsAddModalOpen(true)}>
          Lisää rahtikirja
        </button>
      </header>
      <main>
        <div className="dockets-list">
          <table className="dockets-table common-table">
            <thead className="dockets-thead common-thead">
              <tr>
                <th>Rahtikirjanumero</th>
                <th>Toimittaja</th>
                <th>Saapumispäivä</th>

                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {Array.isArray(inDockets) &&
                  inDockets &&
                  inDockets.map((inDocket) => (
                    <tr key={inDocket.id}>
                      <td>{inDocket.docketNumber}</td>
                      <td>{inDocket.vendorId}</td>
                      <td>
                        {new Date(inDocket.createdAt).toLocaleDateString(
                          'FI-fi'
                        )}
                      </td>
                      <td>
                        <button onClick={() => setIsFullModalOpen(true)}>
                          Näytä
                        </button>
                      </td>
                    </tr>
                  ))}
                <td>123456</td>
                <td>Pacovis</td>
                <td>12.12.2021</td>

                <td>
                  <button onClick={() => editInDocket({} as InDocket)}>
                    Muokkaa
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
      {isEditModalOpen && inDocket && (
        <EditInDocketModal
          onClose={() => setIsEditModalOpen(false)}
          inDocket={inDocket}
          stateChange={handleState}
        />
      )}
      {isAddModalOpen && (
        <AddInDocketModal
          onClose={() => setIsAddModalOpen(false)}
          stateChange={handleState}
        />
      )}
    </div>
  );
};

export default InDocketsPage;
