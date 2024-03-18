import React from 'react';
import OutDockets from '../components/OutDockets';
import SentOutDockets from '../components/SentOutDockets';
import PendingShipments from '../components/PendingShipments';
import { OutDocket } from '../intefaces/OutDocket';
import { PendingShipment } from '../intefaces/PendingShipment';
import { SentOutDocket } from '../intefaces/SentOutDocket';
import { useOutDockets } from '../hooks/ApiHooks';

const SentShipmentsAndDockets = () => {
  const [outDockets, setOutDockets] = React.useState<OutDocket[]>([]);
  const [pendingShipments, setPendingShipments] = React.useState<
    PendingShipment[]
  >([]);
  const [sentOutDockets, setSentOutDockets] = React.useState<SentOutDocket[]>(
    []
  );
  const { getOutDockets, getPendingShipments, getSentOutDockets } =
    useOutDockets();
  React.useEffect(() => {
    (async () => {
      try {
        const outDockets = await getOutDockets();
        const filteredOutDockets = outDockets.map((docket) => {
          return {
            ...docket,
            products: docket.products?.filter((product) => product.id !== null)
          };
        });

        setOutDockets(
          Array.isArray(filteredOutDockets) ? filteredOutDockets : []
        );
        const pendingShipments = await getPendingShipments();

        setPendingShipments(
          Array.isArray(pendingShipments) ? pendingShipments : []
        );
        const sentOutDockets = await getSentOutDockets();
        setSentOutDockets(Array.isArray(sentOutDockets) ? sentOutDockets : []);
      } catch (error) {
        console.log(error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    console.log({ pendingShipments });
  }, [pendingShipments]);
  return (
    <div className="dockets">
      <OutDockets
        updateState={(
          updateFunction: (prevDockets: PendingShipment[]) => PendingShipment[]
        ) => {
          setPendingShipments(updateFunction(pendingShipments));
        }}
        outDockets={outDockets}
        updateDocketsState={(
          updateFunction: (prevDockets: OutDocket[]) => OutDocket[]
        ) => {
          setOutDockets(updateFunction(outDockets));
        }}
      />
      <PendingShipments
        updatePendingShipmentState={(
          updateFunction: (
            prevPendingShipments: PendingShipment[]
          ) => PendingShipment[]
        ) => {
          setPendingShipments(updateFunction(pendingShipments));
        }}
        pendingShipments={pendingShipments}
        updateSentOutDocketState={(
          updateFunction: (prevDockets: SentOutDocket[]) => SentOutDocket[]
        ) => {
          setSentOutDockets(updateFunction(sentOutDockets));
        }}
        updateOutDocketsState={(
          updateFunction: (prevDockets: OutDocket[]) => OutDocket[]
        ) => {
          setOutDockets(updateFunction(outDockets));
        }}
      />

      <SentOutDockets
        updateState={(
          updateFunction: (prevDockets: SentOutDocket[]) => SentOutDocket[]
        ) => {
          setSentOutDockets(updateFunction(sentOutDockets));
        }}
        sentOutDockets={sentOutDockets}
      />
    </div>
  );
};

export default SentShipmentsAndDockets;
