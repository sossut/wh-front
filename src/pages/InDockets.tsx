import React from 'react';
import { useInDockets } from '../hooks/ApiHooks';
import { InDocket } from '../intefaces/InDocket';

const InDocketsPage = () => {
  const {getInDockets, postInDocket} = useInDockets();
  const [inDockets, setInDockets] = React.useState<InDocket[]>([]);
  const [inDocket, setInDocket] = React.useState<InDocket | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isFullModalOpen, setIsFullModalOpen] = React.useState(false);
  React.useEffect(() => {
    (async () => {
      const inDockets = await getInDockets();
      setInDockets(inDockets);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className='dockets-body common-body'>
      <header className="dockets-header common-header">
      <h1>Saapuneet rahtikirjat</h1>
      <div>
          <input type="text" placeholder="Hae"></input>
          <button>Hae</button>
        </div>

      <button onClick={() => setIsAddModalOpen(true)}>Lisää rahtikirja</button>
      </header>
      <main>
        <div className='dockets-list'>
          <table className='dockets-table common-table'>
            <thead className='dockets-thead common-thead'>
              <tr>
                <th>Rahtikirjanumero</th>
                <th>Saapumisaika</th>
                
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>123456</td>
                <td>12.12.2021 12:00</td>
                
                <td><button onClick={() => setIsEditModalOpen(true)}>Muokkaa</button></td>
              </tr>
            </tbody>
          </table>
          {inDockets && inDockets.length > 0 && inDockets.map((inDocket) => (
            <div key={inDocket.id} className='docket'>
              <p>Rahtikirjanumero: {inDocket.docketNumber}</p>
              <p>Saapumisaika: {inDocket.arrivalAt ? new Date(inDocket.arrivalAt).toLocaleString() : 'N/A'}</p>
              <button onClick={() => setIsFullModalOpen(true)}>Vastaanota</button>
              <button onClick={() => setIsEditModalOpen(true)}>Muokkaa</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default InDocketsPage;
