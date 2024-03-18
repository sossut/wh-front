import React from 'react';
import { SentOutDocket } from '../intefaces/SentOutDocket';
import { PendingShipment } from '../intefaces/PendingShipment';
import { Client } from '../intefaces/Client';
import { useOutDockets } from '../hooks/ApiHooks';
import { OutDocket } from '../intefaces/OutDocket';
import { DaysShipments } from '../intefaces/DaysShipments';
import { DaysShipmentsSentOutDocket } from '../intefaces/DaysShipmentsSentOutDocket';

export interface ShippedDocketsModalProps {
  onClose: () => void;
  updatePendingShipmentsState: (
    updateFunction: (prevDockets: PendingShipment[]) => PendingShipment[]
  ) => void;
  pendingShipments: PendingShipment[];
  updateSentOutDocketState: (
    updateFunction: (prevDockets: SentOutDocket[]) => SentOutDocket[]
  ) => void;
  updateOutDocketsState: (
    updateFunction: (prevDockets: OutDocket[]) => OutDocket[]
  ) => void;
}

const ShippedDocketsModal: React.FC<ShippedDocketsModalProps> = ({
  onClose,
  updatePendingShipmentsState,
  pendingShipments,
  updateSentOutDocketState,
  updateOutDocketsState
}) => {
  const [isSent, setIsSent] = React.useState(false);
  const [outDockets, setOutDockets] = React.useState<OutDocket[]>([]);
  const {
    postSentOutDocket,
    getOutDocketsByIds,
    deletePendingShipment,
    getPendingShipments,
    getSentOutDockets,
    postDaysShipments,
    getOutDockets
  } = useOutDockets();
  const handleSent = async () => {
    try {
      const dss: DaysShipments = {
        departedAt: new Date(),
        sentOutDockets: []
      };
      await Promise.all(
        pendingShipments.map(async (pendingShipment) => {
          const sentOutDocket: unknown = {
            docketId: pendingShipment.outDocket.outDocketId as number,
            departureAt: pendingShipment.departureAt,
            parcels: pendingShipment.parcels,
            transportOptionId: pendingShipment.transportOption.id,

            products: pendingShipment.products.map((product) => {
              return {
                productId: product.id as number,
                deliveredProductQuantity: product.collectedProductQuantity,
                outDocketProductId: product.outDocketProductId
              };
            })
          };

          const sod = await postSentOutDocket(sentOutDocket);
          if (typeof sod.id !== 'number') {
            throw new Error('sod.id is not a number');
          }
          const dssod: DaysShipmentsSentOutDocket = {
            sentOutDocketId: sod.id as number
          };
          dss.sentOutDockets.push(dssod);
        })
      );

      await postDaysShipments(dss);
      setIsSent(true);
      for (const pendingShipment of pendingShipments) {
        await deletePendingShipment(pendingShipment.id as number);
      }
      let newPendingShipments = await getPendingShipments();
      if (!newPendingShipments) {
        newPendingShipments = [];
      }

      updatePendingShipmentsState(() => {
        return newPendingShipments;
      });
      const sentOutDockets = await getSentOutDockets();
      updateSentOutDocketState(() => {
        return sentOutDockets;
      });
      const ids = pendingShipments.map((pendingShipment) => {
        return pendingShipment.outDocket.outDocketId as number;
      });
      const data = {
        ids: ids
      };

      const outDockets = await getOutDocketsByIds(data);
      setOutDockets(outDockets);
      const newOutDockets = (await getOutDockets()) || [];
      updateOutDocketsState(() => {
        return newOutDockets;
      });
    } catch (error) {
      console.log(error);
    }
  };
  console.log({ pendingShipments });
  return (
    <div className="big-modal">
      <button onClick={onClose} className="close-button">
        Sulje
      </button>
      <div className="big-modal-header">
        <h2>Toimitetut Lähetykset</h2>
      </div>
      <table className="common-table">
        <thead>
          <tr>
            <th>Lähtöaika</th>
            <th>Asiakas</th>
            <th>Lähetenumero</th>
            <th>Kuljetusmuoto</th>
            <th>Kolleja</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(pendingShipments) &&
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
              </tr>
            ))}
        </tbody>
      </table>

      <button onClick={handleSent}>Lähetä</button>
      {isSent && (
        <div>
          <h3>Kopioi lähteneet</h3>
          <div>
            {Array.isArray(pendingShipments) &&
              pendingShipments.map((pendingShipment) => (
                <div key={pendingShipment.id}>
                  <p>{pendingShipment.outDocket.docketNumber} </p>
                  <table>
                    <thead>
                      <tr>
                        <th>Lähetenumero</th>
                        <th>Tila</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{pendingShipment.outDocket.docketNumber}</td>
                        <td>
                          {Array.isArray(outDockets) &&
                            outDockets.map((outDocket) => {
                              return outDocket.products?.every(
                                (product) =>
                                  product.deliveredProductQuantity ===
                                  product.orderedProductQuantity
                              )
                                ? 'TM'
                                : // Do something else here
                                  'Something else';
                            })}
                        </td>
                      </tr>
                    </tbody>
                    {/* {pendingShipment.products.map((product) => (
                      
                    ))} */}
                  </table>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippedDocketsModal;
