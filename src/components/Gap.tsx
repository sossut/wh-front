import React from 'react';
import Spot, { SpotProps } from './Spot';
import { RowProps } from './Row';
import { PalletProps } from './Pallet';

export interface GapProps {
  id?: number;
  gapNumber?: number;
  spots?: number;
  rowId?: number | RowProps;
  data?: SpotProps[];
  pallets?: PalletProps[];
  stateChanger: (
    updateFunction: (prevPallets: PalletProps[]) => PalletProps[]
  ) => void;
}

const Gap: React.FC<GapProps> = ({
  gapNumber,
  data,
  pallets,
  stateChanger
}) => {
  return (
    <th className="gap-header">
      {`Väli ${gapNumber}`}
      {data?.map((spot) => {
        return (
          <Spot
            stateChanger={stateChanger}
            pallets={pallets}
            key={spot.id}
            id={spot.id}
            spotNumber={spot.spotNumber}
            palletId={spot.palletId}
            disabled={spot.disabled}
            pallet={spot.pallet}
          />
        );
      })}
    </th>
  );
};

export default Gap;
