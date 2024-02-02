import React from 'react';

import { Product } from '../intefaces/Product';
import clsx from 'clsx';
import { Draggable } from 'react-beautiful-dnd';

export interface PalletProps extends React.PropsWithChildren {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  products?: Product[];

  spotId?: number;
  draggable?: boolean;
  onClick?: () => void;
  // onDragStart?: (event: React.DragEvent) => void;
}

const Pallet: React.FC<PalletProps> = ({
  products,
  id,
  spotId,
  draggable,
  onClick
  // onDragStart
}) => {
  const [productsState, setProductsState] = React.useState<Product[]>([]);
  const draggableClass = clsx({
    ['spot-content-div']: true,
    ['draggable']: id != null
  });
  React.useEffect(() => {
    const sorted = products?.sort((a, b) => a.code.localeCompare(b.code));
    setProductsState(sorted || []);
  }, [products]);
  return (
    <Draggable
      draggableId={`${id}`}
      index={spotId ? spotId : 0}
      key={id}
      isDragDisabled={draggable ? false : true}
    >
      {(provided) =>
        id != 0 || undefined ? (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            // onDragStart={onDragStart}
            className={draggableClass}
            draggable={draggable}
            data-pallet-id={id}
          >
            <p className="spot-content-text">
              {productsState?.map((product, index) => (
                <span key={index}>
                  {product.code}
                  {index < productsState.length - 1 && ', '}
                </span>
              ))}
            </p>
            <button className="spot-content-button" onClick={onClick}>
              {'Muokkaa'}
            </button>
          </div>
        ) : (
          <div
            className={draggableClass}
            data-pallet-id={id}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <p className="spot-content-text">
              {productsState?.map((product, index) => (
                <span key={index}>
                  {product.code}
                  {index < productsState.length - 1 && ', '}
                </span>
              ))}
            </p>
            <button className="spot-content-button" onClick={onClick}>
              {'Muokkaa'}
            </button>
          </div>
        )
      }
    </Draggable>
  );
};

export default Pallet;
