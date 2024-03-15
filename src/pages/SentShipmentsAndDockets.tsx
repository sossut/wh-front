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
      const outDockets = await getOutDockets();
      setOutDockets(Array.isArray(outDockets) ? outDockets : []);
      const pendingShipments = await getPendingShipments();
      console.log('pending from db', pendingShipments);
      setPendingShipments(
        Array.isArray(pendingShipments) ? pendingShipments : []
      );
      const sentOutDockets = await getSentOutDockets();
      setSentOutDockets(Array.isArray(sentOutDockets) ? sentOutDockets : []);
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
      />
      <PendingShipments
        updateState={(
          updateFunction: (
            prevPendingShipments: SentOutDocket[]
          ) => SentOutDocket[]
        ) => {
          setSentOutDockets(updateFunction(sentOutDockets));
        }}
        pendingShipments={pendingShipments}
      />

      <SentOutDockets
        updateState={(
          updateFunction: (prevDockets: SentOutDocket[]) => SentOutDocket[]
        ) => {
          setSentOutDockets(updateFunction(sentOutDockets));
        }}
      />
    </div>
  );
};

export default SentShipmentsAndDockets;
