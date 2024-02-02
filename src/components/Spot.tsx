import React, { useState } from 'react';
import Pallet, { PalletProps } from './Pallet';
import PalletModal from './PalletModal';
import { Droppable } from 'react-beautiful-dnd';
import { Product } from '../intefaces/Product';

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

  return (
    <>
      <table className="spot-table">
        <tbody>
          <tr className="spot-row" data-spot-id={`${id}`}>
            <td className="spot-number">{spotNumber}</td>
            <Droppable droppableId={`${id}`} type="spot">
              {(provided) => (
                <td
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  // onDragOver={handleDragOver}
                  // onDrop={handleDrop}
                  className={`spot-content ${disabled ? '' : 'droppable'}`}
                  data-pallet-spot-id={`${id}`}
                >
                  {
                    <Pallet
                      // onDragStart={handleDragStart}
                      // key={currentPallet?.id}
                      // {...currentPallet}
                      products={currentPallet?.products}
                      id={currentPallet?.id}
                      draggable={!!currentPallet?.id}
                      onClick={handleClick}
                      spotId={id}
                    >
                      {disabled ? 'Ei käytössä' : ''}
                    </Pallet>
                  }
                  {provided.placeholder}
                </td>
              )}
            </Droppable>
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
