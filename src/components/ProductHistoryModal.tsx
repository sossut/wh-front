import React from 'react'
import { Product } from '../intefaces/Product';

export interface ProductHistoryModalProps {
    onClose: () => void;
    product: Product | null;
}

const ProductHistoryModal: React.FC<ProductHistoryModalProps> = ({onClose, product}) => {
  const [history, setHistory] = React.useState([])
  return (
    <div className='modal product-history-modal'>
        <button className='close' onClick={onClose}>Sulje</button>
        <h2>Tuotteen historiatiedot</h2>
        <p>Tuote: {product?.code} {product?.name}</p>
        <div className='modal-content product-history-modal-content'>
            <table>
                <thead>
                    <tr>
                        <th>Lähti/Saapui</th>
                        <th>Päivämäärä</th>
                        <th>Määrä</th>

                    </tr>
                </thead>
                <tbody>
                    {history.map((h, i: number) => (
                        <tr key={i}>
                            <td>{h.type}</td>
                            <td>{h.date}</td>
                            <td>{h.amount}</td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    </div>
  )
}

export default ProductHistoryModal