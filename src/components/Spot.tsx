import React, { useState } from 'react';
import Pallet, { PalletProps } from './Pallet';
import PalletModal from './PalletModal';

import { Product } from '../intefaces/Product';
import { useWarehouse } from '../hooks/ApiHooks';

export interface SpotProps {
  id?: number;
  spotNumber?: number;
  gapId?: number;
  palletId?: number;
  shelf?: boolean;
  disabled?: boolean;
  rowNumber?: number;
  gapNumber?: number;
  pallet?: PalletProps | null | undefined;
  products?: Product[];
  pallets?: PalletProps[];
  stateChanger: (
    updateFunction: (prevPallets: PalletProps[]) => PalletProps[]
  ) => void;
}

const Spot: React.FC<SpotProps> = ({
  id,
  spotNumber,
  disabled,
  pallets,
  stateChanger
}) => {
  const { putPalletSpot } = useWarehouse();
  const [palletKey, setPalletKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPallet, setCurrentPallet] = useState<PalletProps | null>({});
  React.useEffect(() => {
    if (pallets) {
      for (const pallet of pallets) {
        if (pallet.spotId === id || pallet.spotId === null) {
          setCurrentPallet(pallet);
          break;
        }
      }
    }
  }, [pallets, id]);
  const handleClick = () => {
    setIsModalOpen((prevIsModalOpen) => !prevIsModalOpen);
  };

  const updatePalletData = (updatedPallet: PalletProps | null) => {
    console.log('updatedPallet in updatePalletData', updatedPallet);
    if (updatedPallet) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log('updatedPallet in updatePalletData', updatedPallet);
      setCurrentPallet(updatedPallet);
    } else {
      setCurrentPallet(null);
    }
  };

  const handleDragStart = (event: React.DragEvent) => {
    console.log('CURRENT PALLET AT START', currentPallet);
    console.log('Dragged Spot ID', id);
    console.log(event.target);
    event.dataTransfer?.setData(
      'pallet-id',
      (event.target as HTMLDivElement).getAttribute('data-pallet-id') as string
    );
    const draggableElement = event.target as HTMLDivElement;
    const spotId = draggableElement.parentElement?.parentElement?.getAttribute(
      'data-spot-id'
    ) as string;
    const psId = draggableElement.parentElement?.getAttribute(
      'data-pallet-spot-id'
    ) as string;
    event.dataTransfer?.setData('ps-id', psId);
    event.dataTransfer?.setData('spot-id', spotId);
    console.log('start', spotId);
    console.log('start ps', psId);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    console.log('handleDragOver');
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    console.log('handleDrop');
    const palletId = event.dataTransfer?.getData('pallet-id') as string;
    const spotIdFrom = event.dataTransfer?.getData('spot-id') as string;
    const spotIdTo = event.currentTarget.getAttribute(
      'data-pallet-spot-id'
    ) as string;
    console.log('spotIdTo', spotIdTo);
    console.log('spotIdFrom', spotIdFrom);
    console.log('palletId', palletId);
    if (palletId === 'null') {
      return;
    }
    const eventTarget = event.target as HTMLElement;
    console.log('eventTarget', eventTarget);
    if (!eventTarget.classList.contains('spot-content-div')) {
      return;
    }

    const draggableElement = document.querySelector(
      `[data-pallet-id="${palletId}"]`
    ) as HTMLDivElement;
    console.log('key', palletKey);
    console.log('draggableElement', draggableElement);
    const dropzone = eventTarget?.parentElement as HTMLDivElement;
    console.log('dropzone', dropzone);
    if (draggableElement && draggableElement.parentElement) {
      draggableElement.parentElement.replaceChildren(draggableElement);
    }

    setPalletKey((prevKey) => prevKey + 1);
    console.log('products', currentPallet?.products);
    // Update the currentPallet state with the new properties

    setCurrentPallet(null);

    stateChanger((prevPallets) => {
      const newPallets = [...prevPallets];
      const palletIndex = newPallets.findIndex(
        (pallet) => pallet.id === parseInt(palletId)
      );
      const otherPalletIndex = newPallets.findIndex(
        (pallet) => pallet.spotId === parseInt(spotIdTo)
      );

      if (palletIndex !== -1 && otherPalletIndex !== -1) {
        const originalSpotId = newPallets[palletIndex].spotId;

        newPallets[palletIndex] = {
          ...newPallets[palletIndex],
          spotId: parseInt(spotIdTo)
        };

        newPallets[otherPalletIndex] = {
          ...newPallets[otherPalletIndex],
          spotId: originalSpotId
        };
      }

      return newPallets;
    });
    putPalletSpot(parseInt(palletId), parseInt(spotIdTo));
    // Update the spots array in the context
  };

  return (
    <>
      <table className="spot-table">
        <tbody>
          <tr className="spot-row" data-spot-id={`${id}`}>
            <td className="spot-number">{spotNumber}</td>

            <td
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`spot-content ${disabled ? '' : 'droppable'}`}
              data-pallet-spot-id={`${id}`}
            >
              {
                <Pallet
                  onDragStart={handleDragStart}
                  products={currentPallet?.products}
                  id={currentPallet?.id}
                  draggable={!!currentPallet?.id}
                  onClick={handleClick}
                  spotId={id}
                >
                  {disabled ? 'Ei käytössä' : ''}
                </Pallet>
              }
            </td>
          </tr>
        </tbody>
      </table>
      {isModalOpen && (
        <PalletModal
          stateChanger={stateChanger}
          spotId={id as number}
          id={currentPallet?.id as number}
          onClose={() => setIsModalOpen(false)}
          onUpdate={updatePalletData}
        />
      )}
    </>
  );
};

export default Spot;
