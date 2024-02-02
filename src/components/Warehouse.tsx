import React, { useContext, useEffect } from 'react';
import Row, { RowProps } from './Row';
import { AppContext } from '../contexts/AppContext';
import { useWarehouse } from '../hooks/ApiHooks';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

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
  const { rows, getRowsWithGapsWithSpots, getPallets, pallets, putPalletSpot } =
    useWarehouse();

  console.log(rows);
  console.log(pallets);
  const [statePallets, setStatePallets] = React.useState<PalletProps[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isDragging, setIsDragging] = React.useState(false);
  const handleState = (
    updateFunction: (prevPallets: PalletProps[]) => PalletProps[]
  ) => {
    setStatePallets(updateFunction);
  };

  const handleDragDrop = async (results: DropResult) => {
    console.log('results', results);
    const { destination, source } = results;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    // check if the spot is already populated if so return without doing anything expect when the pallets id is 0
    if (
      statePallets.find(
        (pallet) => pallet.spotId === parseInt(destination.droppableId)
      ) &&
      statePallets.find(
        (pallet) => pallet.spotId === parseInt(destination.droppableId)
      )?.id !== 0
    ) {
      return;
    }

    // change the spotId of the pallet to the destination spotId
    // and change the spotId of the source spot to the source spotId
    const newPallets = [...statePallets];

    const sourcePalletIndex = newPallets.findIndex(
      (pallet) => pallet.spotId === parseInt(source.droppableId)
    );

    // Find the pallet at the destination spot
    const destinationPalletIndex = newPallets.findIndex(
      (pallet) => pallet.spotId === parseInt(destination.droppableId)
    );

    if (sourcePalletIndex !== -1 && destinationPalletIndex !== -1) {
      // Swap the spotIds of the source and destination pallets
      const temp = newPallets[sourcePalletIndex].spotId;
      newPallets[sourcePalletIndex].spotId =
        newPallets[destinationPalletIndex].spotId;
      newPallets[destinationPalletIndex].spotId = temp;
    }

    setStatePallets(newPallets);
    //find the id of the pallet that is being moved
    const palletId = parseInt(results.draggableId);
    //find the spotId of the destination
    const spotId = parseInt(destination.droppableId);

    await putPalletSpot(palletId, spotId);
    setIsDragging(false);
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
  useEffect(() => {
    console.log('isDragging', isDragging);
  }, [isDragging]);
  return (
    <DragDropContext
      onDragEnd={handleDragDrop}
      onDragStart={() => setIsDragging(true)}
    >
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
    </DragDropContext>
  );
};

export default Warehouse;
