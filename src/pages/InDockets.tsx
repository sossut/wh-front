import React from 'react';
import { useInDockets } from '../hooks/ApiHooks';
import { InDocket } from '../intefaces/InDocket';
import EditInDocketModal from '../components/EditInDocketModal';
import AddInDocketModal from '../components/AddInDocketModal';
import { Vendor } from '../intefaces/Vendor';

const InDockets = () => {
  const { getInDockets } = useInDockets();
  const [inDockets, setInDockets] = React.useState<InDocket[]>([]);
  const [inDocket, setInDocket] = React.useState<InDocket | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  const handleState = (
    updateFunction: (prevDockets: InDocket[]) => InDocket[]
  ) => {
    setInDockets((prevDockets) => updateFunction(prevDockets));
  };
  const editInDocket = (inDocket: InDocket) => {
    setInDocket(inDocket);
    setIsEditModalOpen(true);
  };
  React.useEffect(() => {
    (async () => {
      const inDockets = await getInDockets();
      console.log(inDockets);
      setInDockets(Array.isArray(inDockets) ? inDockets : []);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const search = async (searchString: string) => {
    inDockets.filter((docket) => {
      return docket.docketNumber.includes(searchString);
    });
  };
  return (
    <div className="dockets-body common-body">
      <header className="dockets-header common-header">
        <h1>Saapuneet rahtikirjat</h1>
        <div>
          <input
            onChange={(e) => search(e.target.value)}
            type="text"
            placeholder="Hae"
          ></input>
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
              {Array.isArray(inDockets) &&
                inDockets &&
                inDockets.map((inDocket) => (
                  <tr key={inDocket.id}>
                    <td>{inDocket.docketNumber}</td>
                    <td>{(inDocket.vendor as Vendor).name}</td>
                    <td>
                      {new Date(inDocket.createdAt ?? '').toLocaleDateString(
                        'FI-fi'
                      )}
                    </td>
                    <td>
                      <button onClick={() => editInDocket(inDocket)}>
                        Näytä
                      </button>
                    </td>
                  </tr>
                ))}
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

export default InDockets;
