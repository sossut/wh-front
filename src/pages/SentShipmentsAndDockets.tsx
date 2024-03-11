import React from 'react';
import OutDockets from '../components/OutDockets';
import SentOutDockets from '../components/SentOutDockets';
import PendingShipments from '../components/PendingShipments';

const SentShipmentsAndDockets = () => {
  return (
    <div className="dockets">
      <OutDockets />
      <PendingShipments />
      <SentOutDockets />
    </div>
  );
};

export default SentShipmentsAndDockets;
