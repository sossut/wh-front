import React from 'react';
import { Product } from '../intefaces/Product';
import { useProducts } from '../hooks/ApiHooks';

export interface AddProductModalProps {
  onClose: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ onClose }) => {
  const { postProduct } = useProducts();
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
    postProduct(product);
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
              onChange={(event) =>
                setProduct({ ...product, code: event.target.value })
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
              value={product.name}
              onChange={(event) =>
                setProduct({ ...product, name: event.target.value })
              }
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
              onChange={(event) =>
                setProduct({ ...product, weight: Number(event.target.value) })
              }
            />
          </div>
          <div>
            <label htmlFor="product-quantity">Tuotetta varastossa</label>
            <input
              type="number"
              id="product-quantity"
              name="product-quantity"
              required
              value={product.quantity}
              onChange={(event) =>
                setProduct({ ...product, quantity: Number(event.target.value) })
              }
            />
          </div>
          <div>
            <label htmlFor="product-price">Tuotteen hinta</label>
            <input
              type="number"
              id="product-price"
              name="product-price"
              required
              value={product.price}
              onChange={(event) =>
                setProduct({ ...product, price: Number(event.target.value) })
              }
            />
          </div>

          <div>
            <label htmlFor="quantity-option">Määräyksikkö</label>
            <select
              id="quantity-option"
              name="quantity-option"
              value={product.quantityOptionId.toString()}
              onChange={(event) =>
                setProduct({
                  ...product,
                  quantityOptionId: Number(event.target.value)
                })
              }
            >
              <option value="1">pak</option>
              <option value="2">kpl</option>
              <option value="3">ltk</option>
            </select>
          </div>

          <button type="submit">Lisää</button>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
