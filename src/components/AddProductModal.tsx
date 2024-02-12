import React from 'react';
import { Product } from '../intefaces/Product';

export interface AddProductModalProps {
  onClose: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ onClose }) => {
  const hanldeClick = () => {
    onClose();
  };
  const [product, setProduct] = React.useState<Product>({
    code: '',
    name: '',
    weight: 0,
    quantity: 0,
    price: 0,
    quantityOptionId: 1,
    productCategoryId: 1,
    productSubCategoryId: 1
  });
  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(product);
  };
  const setProductCode = (code: string) => {
    setProduct({ ...product, code });
  };
  const setProductName = (name: string) => {
    setProduct({ ...product, name });
  };
  const setProductWeight = (weight: number) => {
    setProduct({ ...product, weight });
  };
  return (
    <div className="modal">
      <button className="close-button" onClick={hanldeClick}>
        Sulje
      </button>
      <div className="modal-content">
        <h3>Lisää tuote</h3>
        <form onSubmit={handleFormSubmit}>
          <div>
            <label htmlFor="product-code">Tuotekoodi</label>
            <input
              type="text"
              id="product-code"
              name="product-code"
              required
              value={product.code}
              onChange={(event) => setProductCode(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="product-name">Tuotteen nimi</label>
            <input
              type="text"
              id="product-name"
              name="product-name"
              required
              value={product.name}
              onChange={(event) => setProductName(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="product-weight">Tuotteen paino</label>
            <input
              type="number"
              id="product-weight"
              name="product-weight"
              required
              value={product.weight}
              onChange={(event) => setProductWeight(Number(event.target.value))}
            />
          </div>

          <button type="submit">Lisää</button>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
