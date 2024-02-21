import React from 'react'
import { Product } from '../intefaces/Product';

export interface ProductHistoryModalProps {
    onClose: () => void;
    product: Product | null;
}

const ProductHistoryModal: React.FC<ProductHistoryModalProps> = ({onClose, product}) => {
  return (
    <div className='modal product-history-modal'>
        <button className='close' onClick={onClose}>Sulje</button>
        <h2>Tuotteen historiatiedot</h2>
        <p>Tuote: {product?.code} {product?.name}</p>
        <div className='modal-content product-history-modal-content'>
        
        </div>
    </div>
  )
}

export default ProductHistoryModal