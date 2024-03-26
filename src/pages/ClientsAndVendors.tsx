import React from 'react';
import { useClients, useVendors } from '../hooks/ApiHooks';
import { Client } from '../intefaces/Client';
import { Vendor } from '../intefaces/Vendor';

const ClientsAndVendors = () => {
  const { getVendors } = useVendors();
  const { getClients } = useClients();
  const [clients, setClients] = React.useState<Client[]>([]);
  const [vendors, setVendors] = React.useState<Vendor[]>([]);
  React.useEffect(() => {
    (async () => {
      const clients = await getClients();
      const vendors = await getVendors();
      setClients(Array.isArray(clients) ? clients : []);
      setVendors(Array.isArray(vendors) ? vendors : []);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div>ClientsAndVendors</div>;
};

export default ClientsAndVendors;
