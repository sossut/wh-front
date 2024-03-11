import React from 'react';

import { useOutDockets } from '../hooks/ApiHooks';
import { PendingShipment } from '../intefaces/PendingShipment';
import { Client } from '../intefaces/Client';

const PendingShipments = () => {
  const [pendingShipments, setPendingShipments] = React.useState<
    PendingShipment[]
  >([]);
  const [deliveredShipments, setDeliveredShipments] = React.useState<
    PendingShipment[]
  >([]);
  const { getPendingShipments } = useOutDockets();
  React.useEffect(() => {
    (async () => {
      const pending = await getPendingShipments();
      console.log(pending);
      if (pending) {
        setPendingShipments(pending);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="common-body">
      <div className="common-header">
        <h1>Odottavat Lähetykset</h1>
      </div>
      <table className="common-table">
        <thead>
          <tr>
            <th>Lähtöaika</th>
            <th>Asiakas</th>
            <th>Lähetenumero</th>
            <th>Kuljetusmuoto</th>
            <th>Parcels</th>
            <th>Actions</th>
            <th>Toimitettu</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(pendingShipments) &&
            pendingShipments &&
            pendingShipments.map((pendingShipment) => (
              <tr key={pendingShipment.id}>
                <td>
                  {new Date(pendingShipment.departureAt).toLocaleDateString(
                    'FI-fi'
                  )}
                </td>
                <td>{(pendingShipment.client as Client).name}</td>
                <td>{pendingShipment.outDocket.docketNumber}</td>
                <td>{pendingShipment.transportOption.transportOption}</td>
                <td>{pendingShipment.parcels}</td>
                <td>
                  <button>View</button>
                </td>
                <td>
                  <input type="checkbox" />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingShipments;
