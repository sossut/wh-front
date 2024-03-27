import React from 'react';
import { Client } from '../intefaces/Client';
import { useClients } from '../hooks/ApiHooks';

export interface ClientsProps {
  clients: Client[];
  updateClientsState: (updateFunction: (clients: Client[]) => Client[]) => void;
}

const Clients: React.FC<ClientsProps> = ({ clients, updateClientsState }) => {
  const { postClient } = useClients();
  const [clientName, setClientName] = React.useState('');
  const addNewClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newClient = await postClient({ name: clientName });
    if (!newClient) {
      return;
    }
    updateClientsState((prevClients) => [
      ...prevClients,
      {
        id: newClient.id,
        name: clientName
      }
    ]);
  };
  return (
    <div>
      <h1>Asiakkaat</h1>
      <form onSubmit={addNewClient}>
        <input
          type="text"
          placeholder="Asiakkaan nimi"
          onChange={(e) => {
            setClientName(e.target.value);
          }}
        />
        <button type="submit">Lisää toimittaja</button>
      </form>
      <div>
        {Array.isArray(clients) &&
          clients.map((client) => (
            <div key={client.id}>
              <p>{client.name}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Clients;
