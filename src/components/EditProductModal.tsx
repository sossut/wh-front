import React from 'react';
import { Product } from '../intefaces/Product';
import { useProducts } from '../hooks/ApiHooks';
import { QuantityOption } from '../intefaces/QuantityOption';

export interface EditProductModalProps {
  onClose: () => void;
  product: Product | null;
  stateChanger: (
    updateFunction: (prevProducts: Product[]) => Product[]
  ) => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  onClose,
  product,
  stateChanger
}) => {
  const { getQuantityOptions, putProduct } = useProducts();
  const [quantityOptions, setQuantityOptions] = React.useState<
    QuantityOption[]
  >([]);
  const initialProductState = React.useMemo(
    () => ({
      code: product?.code || '',
      name: product?.name || '',
      weight: product?.weight || 0,
      quantity: product?.quantity || 0,
      price: product?.price || 0,
      quantityOptionId: product?.quantityOptionId || 1,
      productCategoryId: product?.productCategoryId || null,
      productSubCategoryId: product?.productSubCategoryId || null
    }),
    [product]
  );
  const [productState, setProductState] =
    React.useState<Product>(initialProductState);
  const hanldeClick = () => {
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(productState);
    const updatedProduct = await putProduct(product?.id, productState);
    if (updatedProduct) {
      stateChanger((prevProducts) => {
        return prevProducts.map((p) => {
          if (p.id === updatedProduct.id) {
            return updatedProduct;
          }
          return p;
        });
      });
      onClose();
    }
  };

  React.useEffect(() => {
    const fetchQuantityOptions = async () => {
      const quantityOptions = await getQuantityOptions();
      setQuantityOptions(quantityOptions);
    };
    fetchQuantityOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="modal">
      <button className="close-button" onClick={hanldeClick}>
        Sulje
      </button>
      <div className="modal-content">
        <h3>Muokkaa tuotetta</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="product-code">Tuotekoodi</label>
            <input
              type="text"
              id="product-code"
              name="product-code"
              required
              value={productState?.code}
              onChange={(event) =>
                setProductState({ ...productState, code: event.target.value })
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
              value={productState?.name}
              onChange={(event) =>
                setProductState({ ...productState, name: event.target.value })
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
              value={productState?.weight}
              onChange={(event) =>
                setProductState({
                  ...productState,
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
              value={productState?.quantity}
              onChange={(event) =>
                setProductState({
                  ...productState,
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
              value={productState?.price}
              onChange={(event) =>
                setProductState({
                  ...productState,
                  price: parseInt(event.target.value)
                })
              }
            />
          </div>
          <div>
            <label htmlFor="quantity-option">Määräyksikkö</label>
            <select
              id="quantity-option"
              name="quantity-option"
              value={productState?.quantityOptionId.toString()}
              onChange={(event) =>
                setProductState({
                  ...productState,
                  quantityOptionId: parseInt(event.target.value)
                })
              }
            >
              {quantityOptions.map((option) => (
                <option key={option.id} value={option.id.toString()}>
                  {option.quantityOption}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">Tallenna</button>
        </form>
      </div>
      <p>
        {productState?.updatedAt &&
          new Date(productState.updatedAt).toLocaleDateString('FI-fi')}
      </p>
    </div>
  );
};

export default EditProductModal;
