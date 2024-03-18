import React from 'react';

import { PendingShipment } from '../intefaces/PendingShipment';
import { Client } from '../intefaces/Client';
import PendingShipmentModal from './PendingShipmentModal';
import { SentOutDocket } from '../intefaces/SentOutDocket';
import ShippedDocketsModal from './ShippedDocketsModal';
import { OutDocket } from '../intefaces/OutDocket';

export interface PendingShipmentsProps {
  updatePendingShipmentState: (
    updateFunction: (
      prevPendingShipments: PendingShipment[]
    ) => PendingShipment[]
  ) => void;
  pendingShipments: PendingShipment[];
  updateSentOutDocketState: (
    updateFunction: (prevDockets: SentOutDocket[]) => SentOutDocket[]
  ) => void;
  updateOutDocketsState: (
    updateFunction: (prevDockets: OutDocket[]) => OutDocket[]
  ) => void;
}

const PendingShipments: React.FC<PendingShipmentsProps> = ({
  updatePendingShipmentState,
  pendingShipments,
  updateSentOutDocketState,
  updateOutDocketsState
}) => {
  // const [pendingShipments, setPendingShipments] = React.useState<
  //   PendingShipment[]
  // >([]);
  const [pendingShipment, setPendingShipment] =
    React.useState<PendingShipment>();
  const [checked, setChecked] = React.useState<PendingShipment[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isShipperModalOpen, setIsShipperModalOpen] = React.useState(false);
  const handleModalOpen = (pendingShipment: PendingShipment) => {
    setIsModalOpen(true);
    setPendingShipment(pendingShipment);
  };
  const handleSent = () => {
    console.log({ checked });
    setIsShipperModalOpen(true);
  };
  return (
    <div className="common-body">
      <div className="common-header">
        <h1>Odottavat Lähetykset</h1>
        <button onClick={handleSent}>Toimitukseen</button>
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
                  <input
                    type="checkbox"
                    checked={checked.includes(pendingShipment)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setChecked([...checked, pendingShipment]);
                      } else {
                        setChecked(
                          checked.filter((item) => item !== pendingShipment)
                        );
                      }
                    }}
                  />
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
      {isShipperModalOpen && (
        <ShippedDocketsModal
          onClose={() => setIsShipperModalOpen(false)}
          pendingShipments={checked}
          updatePendingShipmentsState={updatePendingShipmentState}
          updateSentOutDocketState={updateSentOutDocketState}
          updateOutDocketsState={updateOutDocketsState}
        />
      )}
    </div>
  );
};

export default PendingShipments;
