import React from 'react';
import { PendingShipment } from '../intefaces/PendingShipment';
import { Client } from '../intefaces/Client';

export interface PendingShipmentModalProps {
  onClose: () => void;
  pendingShipment: PendingShipment;
  // stateChanger: (
  //   updateFunction: (
  //     prevPallets: PendingShipmentModalProps[]
  //   ) => PendingShipmentModalProps[]
  // ) => void;
}

const PendingShipmentModal: React.FC<PendingShipmentModalProps> = ({
  onClose,
  pendingShipment
}) => {
  const [pendingShipmentState, setPendingShipmentState] =
    React.useState<PendingShipment>();
  React.useEffect(() => {
    setPendingShipmentState(pendingShipment);
  }, [pendingShipment]);

  return (
    <div className="big-modal">
      <button className="close-button" onClick={onClose}>
        Sulje
      </button>
      <div className="big-modal-header">
        <h2>Lähetys</h2>
        <div className="big-modal-header-content">
          <div>
            <h3>Lähtöaika</h3>
            <p>
              {new Date(pendingShipment.departureAt).toLocaleDateString(
                'FI-fi'
              )}
            </p>
          </div>
          <div>
            <h3>Asiakas</h3>
            <p>{(pendingShipment.client as Client).name}</p>
          </div>
          <div>
            <h3>Lähetenumero</h3>
            <p>{pendingShipment.outDocket.docketNumber}</p>
          </div>
          <div>
            <h3>Kuljetusmuoto</h3>
            <p>{pendingShipment.transportOption.transportOption}</p>
          </div>
          <div>
            <h3>Kolleja</h3>
            <p>{pendingShipment.parcels}</p>
          </div>
          {/* <div>
            <h3>Toimitettu</h3>
            <button>Delivered</button>
          </div> */}
        </div>
      </div>
      <div className="big-modal-content">
        <h3>Tuotteet</h3>
        <table className="common-table">
          <thead>
            <tr>
              <th>Koodi</th>
              <th>Nimi</th>
              <th>Määrä</th>
            </tr>
          </thead>
          <tbody>
            {pendingShipmentState?.products.map((product) => (
              <tr key={product.id}>
                <td>{product.code}</td>
                <td>{product.name}</td>

                <td>
                  <input
                    type="number"
                    value={product.collectedProductQuantity}
                    onChange={(e) =>
                      setPendingShipmentState({
                        ...pendingShipmentState,
                        products: pendingShipmentState.products.map((p) => {
                          if (p.id === product.id) {
                            return {
                              ...p,
                              collectedProductQuantity: Number(e.target.value)
                            };
                          }
                          return p;
                        })
                      })
                    }
                  ></input>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingShipmentModal;
