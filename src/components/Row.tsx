import React from 'react';
import Gap, { GapProps } from './Gap';

import { PalletProps } from './Pallet';

export interface RowProps {
  id?: number;
  rowNumber?: number;
  gaps?: number;
  data?: GapProps[];
  stateChanger: (
    updateFunction: (prevPallets: PalletProps[]) => PalletProps[]
  ) => void;
  pallets?: PalletProps[];
}

const Row: React.FC<RowProps> = ({
  rowNumber,
  data,
  pallets,
  stateChanger
}) => {
  const [rowPallets, setRowPallets] = React.useState<PalletProps[]>(
    pallets || []
  );
  React.useEffect(() => {
    setRowPallets(pallets || []);
  }, [pallets]);
  return (
    <tr className="column">
      <th className="row-header">
        {`Lavarivi ${rowNumber}`}
        {data?.map((gap) => {
          // const spotsInGap =
          //   spots?.filter((spot) => spot.gapId === gap.id) || [];
          return (
            <Gap
              stateChanger={stateChanger}
              pallets={rowPallets}
              key={gap.id}
              id={gap.id}
              gapNumber={gap.gapNumber}
              data={gap.data}
            />
          );
        })}
      </th>
    </tr>
  );
};

export default Row;
