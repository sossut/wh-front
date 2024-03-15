import React from 'react';

import { useOutDockets } from '../hooks/ApiHooks';
import { PendingShipment } from '../intefaces/PendingShipment';
import { Client } from '../intefaces/Client';
import PendingShipmentModal from './PendingShipmentModal';
import { SentOutDocket } from '../intefaces/SentOutDocket';

export interface PendingShipmentsProps {
  updateState: (
    updateFunction: (prevPendingShipments: SentOutDocket[]) => SentOutDocket[]
  ) => void;
  pendingShipments: PendingShipment[];
}

const PendingShipments: React.FC<PendingShipmentsProps> = ({
  updateState,
  pendingShipments
}) => {
  // const [pendingShipments, setPendingShipments] = React.useState<
  //   PendingShipment[]
  // >([]);
  const [pendingShipment, setPendingShipment] =
    React.useState<PendingShipment>();
  const [deliveredShipments, setDeliveredShipments] = React.useState<
    PendingShipment[]
  >([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleModalOpen = (pendingShipment: PendingShipment) => {
    setIsModalOpen(true);
    setPendingShipment(pendingShipment);
  };
  React.useEffect(() => {
    // (async () => {
    //   const pending = await getPendingShipments();
    //   console.log(pending);
    //   if (pending) {
    //     setPendingShipments(pending);
    //   }
    // })();
    console.log('PendingShipments', pendingShipments);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="common-body">
      <div className="common-header">
        <h1>Odottavat Lähetykset</h1>
        <button onClick={() => console.log('clicked')}>Toimitukseen</button>
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
                  <button onClick={() => handleModalOpen(pendingShipment)}>
                    View
                  </button>
                </td>
                <td>
                  <input type="checkbox" />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {isModalOpen && (
        <PendingShipmentModal
          onClose={() => setIsModalOpen(false)}
          pendingShipment={pendingShipment as PendingShipment}
        />
      )}
    </div>
  );
};

export default PendingShipments;
