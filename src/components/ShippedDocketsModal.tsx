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
  updateCheckedState: (
    updateFunction: (prevDockets: PendingShipment[]) => PendingShipment[]
  ) => void;
}

const ShippedDocketsModal: React.FC<ShippedDocketsModalProps> = ({
  onClose,
  updatePendingShipmentsState,
  pendingShipments,
  updateSentOutDocketState,
  updateOutDocketsState,
  updateCheckedState
}) => {
  const [isSent, setIsSent] = React.useState(false);
  const [outDockets, setOutDockets] = React.useState<OutDocket[]>([]);
  const [daysShipments, setDaysShipments] = React.useState<DaysShipments>();
  const [backOrderArray, setBackOrderArray] = React.useState<OutDocket[]>([]);
  const {
    postSentOutDocket,
    getOutDocketsByIds,
    deletePendingShipment,
    getPendingShipments,
    getSentOutDockets,
    postDaysShipments,
    getOutDockets,
    getOutDocketsBackOrder
  } = useOutDockets();
  const handleSent = async () => {
    try {
      const dss: DaysShipments = {
        departedAt: new Date(),
        sentOutDockets: []
      };
      setDaysShipments(dss);
      const ids = pendingShipments.map((pendingShipment) => {
        return pendingShipment.outDocket?.outDocketId as number;
      });
      const data = {
        ids: ids
      };
      const bOArray = await getOutDocketsBackOrder(data);
      setBackOrderArray(bOArray);
      await Promise.all(
        pendingShipments.map(async (pendingShipment) => {
          const sentOutDocket: unknown = {
            docketId: pendingShipment.outDocket?.outDocketId as number,
            departureAt: daysShipments?.departedAt as Date,
            parcels: pendingShipment.parcels,
            transportOptionId: pendingShipment.transportOption?.id,

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
          daysShipments?.sentOutDockets.push(dssod);
        })
      );

      await postDaysShipments(daysShipments);
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

      const outDockets = await getOutDocketsByIds(data);
      setOutDockets(outDockets);
      const newOutDockets = (await getOutDockets()) || [];
      updateOutDocketsState(() => {
        return newOutDockets;
      });
      updateCheckedState(() => {
        return [];
      });
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    console.log(daysShipments);
  }, [daysShipments]);
  console.log({ pendingShipments });
  return (
    <div className="big-modal">
      <button onClick={onClose} className="close-button">
        Sulje
      </button>
      <div className="big-modal-header">
        <h2>Toimitetut Lähetykset</h2>
        <input
          type="date"
          value={daysShipments?.departedAt?.toISOString().substr(0, 10)}
          onChange={(e) => {
            const newDate = new Date(e.target.value);
            const newDaysShipments = {
              ...daysShipments,
              departedAt: newDate,
              sentOutDockets: daysShipments?.sentOutDockets || []
            };
            setDaysShipments(newDaysShipments);
          }}
        />
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
                <td>{pendingShipment.outDocket?.docketNumber}</td>
                <td>{pendingShipment.transportOption?.transportOption}</td>
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
            {Array.isArray(pendingShipments) && (
              <div>
                <table>
                  <thead>
                    <tr>
                      <th>Lähetenumero</th>
                      <th>Tila</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(outDockets) &&
                      outDockets.map((outDocket) => {
                        const allProductsDelivered = outDocket.products?.every(
                          (product) =>
                            product.deliveredProductQuantity ===
                            product.orderedProductQuantity
                        );
                        const isBackOrder = backOrderArray.some(
                          (backOrder) =>
                            backOrder.id === outDocket.id && backOrder.backOrder
                        );

                        return (
                          <tr key={outDocket.id}>
                            {isBackOrder ? (
                              <td>
                                {outDocket.docketNumber}
                                {'JT'}
                              </td>
                            ) : (
                              <td>{outDocket.docketNumber}</td>
                            )}

                            <td>
                              {allProductsDelivered ? (
                                'TM'
                              ) : (
                                <div>
                                  {outDocket.products?.map((product, index) => {
                                    return (
                                      <div key={index}>
                                        {product.code}{' '}
                                        {product.deliveredProductQuantity} /{' '}
                                        {product.orderedProductQuantity}
                                      </div>
                                    );
                                  })}
                                  {''}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippedDocketsModal;
