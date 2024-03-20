import React from 'react';
import { PendingShipment } from '../intefaces/PendingShipment';
import { Client } from '../intefaces/Client';
import { useOutDockets } from '../hooks/ApiHooks';
import { OutDocket } from '../intefaces/OutDocket';

export interface PendingShipmentModalProps {
  onClose: () => void;
  pendingShipment: PendingShipment;
  stateChanger: (
    updateFunction: (
      prevPallets: PendingShipment[]
    ) => PendingShipment[]
  ) => void;
  updateOutDocketsState: (
    updateFunction: (prevDockets: OutDocket[]) => OutDocket[]
  ) => void;
}

const PendingShipmentModal: React.FC<PendingShipmentModalProps> = ({
  onClose,
  pendingShipment,
  stateChanger,
  updateOutDocketsState
}) => {
  const [pendingShipmentState, setPendingShipmentState] =
    React.useState<PendingShipment>();
  React.useEffect(() => {
    setPendingShipmentState(pendingShipment);
  }, [pendingShipment]);
  const {putPendingShipment, deletePendingShipment, getPendingShipment, getOutDocket} = useOutDockets();
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('submit');
    await putPendingShipment(pendingShipment.id as number, pendingShipmentState as PendingShipment);
    const newPendingShipment = await getPendingShipment(pendingShipment.id as number);
    stateChanger((prevPallets) => {
      return prevPallets.map((p) => {
        if (p.id === pendingShipment.id) {
          return newPendingShipment;
        }
        return p;
      });     
    });
    const outDocket = await getOutDocket(pendingShipment.outDocket.id as number);
    updateOutDocketsState((prevDockets) => {
      return prevDockets.map((d) => {
        if (d.id === outDocket.id) {
          return outDocket;
        }
        return d;
      });
    });
  }
  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('delete');
    await deletePendingShipment(pendingShipment.id as number);
  }
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
            <button onClick={handleSubmit}>Tallenna</button>
          </tbody>
        </table>
        
          <button onClick={handleDelete}>Poista</button>
      </div>
    </div>
  );
};

export default PendingShipmentModal;
