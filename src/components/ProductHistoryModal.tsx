import React from 'react';
import { Product } from '../intefaces/Product';
import { useProducts } from '../hooks/ApiHooks';
import { ProductHistory } from '../intefaces/ProductHistory';

export interface ProductHistoryModalProps {
  onClose: () => void;
  product: Product | null;
}

const ProductHistoryModal: React.FC<ProductHistoryModalProps> = ({
  onClose,
  product
}) => {
  const { getProductHistory } = useProducts();
  const [history, setHistory] = React.useState<ProductHistory[]>([]);

  React.useEffect(() => {
    (async () => {
      if (product) {
        const history = await getProductHistory(product.id);
        console.log('history', history);
        setHistory(history);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="modal">
      <button className="close-button" onClick={onClose}>
        Sulje
      </button>
      <h2>Tuotteen historiatiedot</h2>
      <p>
        Tuote: {product?.code} {product?.name}
      </p>
      <div className="modal-content product-history-modal-content">
        <table>
          <thead>
            <tr>
              <th>Lähti/Saapui</th>
              <th>Päivämäärä</th>
              <th>Määrä</th>
              <th>Tilausnumero</th>
            </tr>
          </thead>
          <tbody>
            {history.map((history) => (
              <tr key={history.id}>
                <td>{history.productId}</td>
                <td></td>
                <td>{history.quantity}</td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductHistoryModal;
