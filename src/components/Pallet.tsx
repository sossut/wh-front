import React from 'react';

import { Product } from '../intefaces/Product';
import clsx from 'clsx';

export interface PalletProps extends React.PropsWithChildren {
  id?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  products?: Product[];

  spotId?: number;
  draggable?: boolean;
  onClick?: () => void;
  onDragStart?: (event: React.DragEvent) => void;
}

const Pallet: React.FC<PalletProps> = ({
  products,
  id,
  // spotId,
  draggable,
  onClick,
  onDragStart
}) => {
  const [productsState, setProductsState] = React.useState<Product[]>([]);
  const draggableClass = clsx({
    ['spot-content-div']: true,
    ['draggable']: id != null
  });
  React.useEffect(() => {
    if (Array.isArray(products)) {
      const sorted = products.sort((a, b) => a.code.localeCompare(b.code));
      setProductsState(sorted);
    } else {
      setProductsState([]);
    }
  }, [products]);
  return (
    <div
      onDragStart={onDragStart}
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
  );
};

export default Pallet;
