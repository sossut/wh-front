import React from 'react';
import { Product } from '../intefaces/Product';

export interface EditProductModalProps {
  onClose: () => void;
  product: Product | null;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  onClose,
  product
}) => {
  console.log(product);
  const hanldeClick = () => {
    onClose();
  };
  return (
    <div className="modal">
      <button className="close-button" onClick={hanldeClick}>
        Sulje
      </button>
    </div>
  );
};

export default EditProductModal;
