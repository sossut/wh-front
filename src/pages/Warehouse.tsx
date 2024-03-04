import React, { useContext, useEffect } from 'react';
import Row, { RowProps } from '../components/Row';
import { AppContext } from '../contexts/AppContext';
import { useWarehouse } from '../hooks/ApiHooks';

import { PalletProps } from '../components/Pallet';
import { SpotProps } from '../components/Spot';
import WarehouseSetupModal from '../components/WarehouseSetupModal';
import WarehouseFindProductModal from '../components/WarehouseFindProductModal';
export interface WarehouseProps {
  id?: number;
  name?: string;
  rows?: RowProps[];
  columns?: number;
}

const Warehouse: React.FC<WarehouseProps> = () => {
  const [isSetupModalOpen, setIsSetupModalOpen] = React.useState(false);
  const [isFindProductModalOpen, setIsFindProductModalOpen] =
    React.useState(false);
  const { user } = useContext(AppContext);
  console.log(user);
  const { getRowsWithGapsWithSpots, getPallets } = useWarehouse();
  const [rows, setRows] = React.useState<RowProps[]>([]);
  const [productCode, setProductCode] = React.useState<string>('');

  const [pallets, setPallets] = React.useState<PalletProps[]>([]);
  const [statePallets, setStatePallets] = React.useState<PalletProps[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const handleState = (
    updateFunction: (prevPallets: PalletProps[]) => PalletProps[]
  ) => {
    setStatePallets(updateFunction);
  };

  const handleSumbit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Submitting');
  };

  const handleClick = () => {
    setIsSetupModalOpen((prevIsModalOpen) => !prevIsModalOpen);
  };

  const findProduct = () => {
    const input = document.getElementById(
      'find-product-input'
    ) as HTMLInputElement;
    setProductCode(input.value);
    setIsFindProductModalOpen((prevIsModalOpen) => !prevIsModalOpen);
  };

  useEffect(() => {
    (async () => {
      const rows = await getRowsWithGapsWithSpots();
      console.log({ rows });

      setRows(rows);
      const pallets = await getPallets();
      console.log({ pallets });
      setPallets(pallets);
    })();
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
    <div>
      <div className="wh-setup">
        <button className="setup-button" onClick={handleClick}>
          Setup
        </button>
        <form onSubmit={handleSumbit} className="find-products-form">
          <input id="find-product-input" placeholder="Etsi tuotetta"></input>
          <button onClick={findProduct}>Etsi</button>
        </form>
      </div>
      <div id="warehouse">
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
      {isSetupModalOpen && (
        <WarehouseSetupModal
          warehouse={rows}
          onClose={handleClick}
        ></WarehouseSetupModal>
      )}
      {isFindProductModalOpen && (
        <WarehouseFindProductModal
          onClose={() => setIsFindProductModalOpen(false)}
          productCode={productCode}
        ></WarehouseFindProductModal>
      )}
    </div>
  );
};

export default Warehouse;
