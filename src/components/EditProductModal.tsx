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
  const [productStae, setProductState] = React.useState<Product>({
    code: product?.code || '',
    name: product?.name || '',
    weight: product?.weight || 0,
    quantity: product?.quantity || 0,
    price: product?.price || 0,
    quantityOptionId: product?.quantityOptionId || 1,
    productCategoryId: product?.productCategoryId || 1,
    productSubCategoryId: product?.productSubCategoryId || 1
  });
  const hanldeClick = () => {
    onClose();
  };
  return (
    <div className="modal">
      <button className="close-button" onClick={hanldeClick}>
        Sulje
      </button>
      <div className="modal-content">
        <h3>Muokkaa tuotetta</h3>
        <form>
          <div>
            <label htmlFor="product-code">Tuotekoodi</label>
            <input
              type="text"
              id="product-code"
              name="product-code"
              required
              value={product?.code}
              onChange={(event) =>
                setProductState({ ...productStae, code: event.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="product-name">Tuotteen nimi</label>
            <input
              type="text"
              id="product-name"
              name="product-name"
              required
              value={product?.name}
              onChange={(event) =>
                setProductState({ ...productStae, name: event.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="product-weight">Paino</label>
            <input
              type="number"
              id="product-weight"
              name="product-weight"
              required
              value={product?.weight}
              onChange={(event) =>
                setProductState({
                  ...productStae,
                  weight: parseInt(event.target.value)
                })
              }
            />
          </div>
          <div>
            <label htmlFor="product-quantity">Määrä</label>
            <input
              type="number"
              id="product-quantity"
              name="product-quantity"
              required
              value={product?.quantity}
              onChange={(event) =>
                setProductState({
                  ...productStae,
                  quantity: parseInt(event.target.value)
                })
              }
            />
          </div>
          <div>
            <label htmlFor="product-price">Hinta</label>
            <input
              type="number"
              id="product-price"
              name="product-price"
              required
              value={product?.price}
              onChange={(event) =>
                setProductState({
                  ...productStae,
                  price: parseInt(event.target.value)
                })
              }
            />
          </div>
          <button type="submit">Tallenna</button>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
