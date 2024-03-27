import React from 'react';
import { Client } from '../intefaces/Client';

export interface ClientsProps {
  clients: Client[];
  updateClientsState: (updateFunction: (clients: Client[]) => Client[]) => void;
}

const Clients: React.FC<ClientsProps> = ({ clients, updateClientsState }) => {
  const [clientName, setClientName] = React.useState('');
  const addNewClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateClientsState((prevClients) => [
      ...prevClients,
      {
        id: prevClients.length + 1,
        name: clientName
      }
    ]);
  };
  return (
    <div>
      <h1>Toimittajat</h1>
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
