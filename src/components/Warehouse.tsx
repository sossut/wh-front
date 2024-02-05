import React, { useContext, useEffect } from 'react';
import Row, { RowProps } from './Row';
import { AppContext } from '../contexts/AppContext';
import { useWarehouse } from '../hooks/ApiHooks';

import { PalletProps } from './Pallet';
import { SpotProps } from './Spot';
export interface WarehouseProps {
  id?: number;
  name?: string;
  rows?: RowProps[];
  columns?: number;
}

const Warehouse: React.FC<WarehouseProps> = () => {
  const { user } = useContext(AppContext);
  console.log(user);
  const { rows, getRowsWithGapsWithSpots, getPallets, pallets } =
    useWarehouse();

  console.log(rows);
  console.log(pallets);
  const [statePallets, setStatePallets] = React.useState<PalletProps[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const handleState = (
    updateFunction: (prevPallets: PalletProps[]) => PalletProps[]
  ) => {
    setStatePallets(updateFunction);
  };

  useEffect(() => {
    getRowsWithGapsWithSpots();
    getPallets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const spots = rows?.flatMap((row) =>
      row.data?.flatMap((gap) => gap.data?.map((spot) => spot))
    );
    if (pallets) {
      // Create a map of spot IDs to pallets
      const palletMap = new Map(
        pallets.map((pallet) => [pallet.spotId, pallet])
      );

      // Filter out any undefined spots and create a new array of pallets
      const newPallets = (spots.filter(Boolean) as SpotProps[]).map((spot) => {
        // If there is a pallet for this spot, use it; otherwise, create an empty pallet
        return (
          palletMap.get(spot.id) || {
            id: 0,
            products: [],
            spotId: spot.id
          }
        );
      });

      setStatePallets(newPallets);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pallets]);

  useEffect(() => {
    console.log('Pallets', statePallets);
  }, [statePallets]);

  return (
    <div id="a">
      <table className="warehouse-table">
        <tbody className="warehouse-tbody">
          {rows?.map((row, index) => {
            return (
              <Row
                stateChanger={handleState}
                pallets={statePallets}
                key={index}
                id={row.id}
                rowNumber={row.rowNumber}
                data={row.data}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Warehouse;
