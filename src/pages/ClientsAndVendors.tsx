import React from 'react';
import { useClients, useVendors } from '../hooks/ApiHooks';
import { Client } from '../intefaces/Client';
import { Vendor } from '../intefaces/Vendor';
import Clients from '../components/Clients';
import Vendors from '../components/Vendors';

const ClientsAndVendors = () => {
  const { getVendors } = useVendors();
  const { getClients } = useClients();
  const [clients, setClients] = React.useState<Client[]>([]);
  const [vendors, setVendors] = React.useState<Vendor[]>([]);
  const updateClientsState = (
    updateFunction: (prevClients: Client[]) => Client[]
  ) => {
    setClients((prevClients) => updateFunction(prevClients));
  };
  const updateVendorsState = (
    updateFunction: (prevVendors: Vendor[]) => Vendor[]
  ) => {
    setVendors((prevVendors) => updateFunction(prevVendors));
  };
  React.useEffect(() => {
    (async () => {
      const clients = await getClients();
      const vendors = await getVendors();
      setClients(Array.isArray(clients) ? clients : []);
      setVendors(Array.isArray(vendors) ? vendors : []);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <Clients updateClientsState={updateClientsState} clients={clients} />
      <Vendors updateVendorsState={updateVendorsState} vendors={vendors} />
    </div>
  );
};

export default ClientsAndVendors;
