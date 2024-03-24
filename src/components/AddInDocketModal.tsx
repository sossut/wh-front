import React from 'react';
import { InDocket } from '../intefaces/InDocket';
import { useInDockets, useProducts, useVendors } from '../hooks/ApiHooks';
import { Product } from '../intefaces/Product';
import { InDocketProduct } from '../intefaces/InDocketProduct';
import { Vendor } from '../intefaces/Vendor';

export interface AddInDocketModalProps {
  onClose: () => void;
  stateChange: (
    updateFunction: (prevDockets: InDocket[]) => InDocket[]
  ) => void;
}

const AddInDocketModal: React.FC<AddInDocketModalProps> = ({
  onClose,
  stateChange
}) => {
  const [inDocket, setInDocket] = React.useState<InDocket>({
    docketNumber: '',
    arrivedAt: new Date(),
    vendor: {
      id: 0,
      name: ''
    },
    products: []
  });
  const [isAddingProduct, setIsAddingProduct] = React.useState(false);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [vendors, setVendors] = React.useState<Vendor[]>([]);
  const { postInDocket, getInDocket } = useInDockets();
  const { getVendors } = useVendors();
  const { getProducts } = useProducts();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const iD: InDocket = {
      docketNumber: inDocket.docketNumber,
      arrivedAt: inDocket.arrivedAt,
      vendorId: inDocket.vendor.id,
      products: inDocket.products,
      vendor: inDocket.vendor
    };
    if (!iD.vendorId) {
      alert('Valitse toimittaja');
      return;
    }
    if (!iD.products || iD.products.length === 0) {
      alert('Lisää tuotteita saapumiserään');
      return;
    }
    if (!iD.docketNumber) {
      alert('Anna saapumiserän numero');
      return;
    }
    const id = await postInDocket(iD);
    const newInDocket = await getInDocket(id.id);
    stateChange((prevDockets) => {
      return [...prevDockets, newInDocket];
    });
    onClose();
  };
  React.useEffect(() => {
    (async () => {
      const products = await getProducts();
      setProducts(products);
      const vendors = await getVendors();
      setVendors(vendors);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const addProduct = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setIsAddingProduct(true);
  };
  const removeProduct = (product: InDocketProduct) => {
    const id = product.id;
    setInDocket({
      ...inDocket,
      products: inDocket.products?.filter((p) => p.id !== id)
    });
  };
  const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const selectElement = form.querySelector('select') as HTMLSelectElement;
    const selectedOption = selectElement
      .selectedOptions[0] as HTMLOptionElement & {
      dataset: {
        code: string;
        name: string;
        qoption: string;
      };
    };

    const id = selectElement.value;
    const code = selectedOption.dataset.code;
    const name = selectedOption.dataset.name;
    const orderedProductQuantity = form.orderedProductQuantity.value;
    const receivedProductQuantity = form.receivedProductQuantity.value;
    const quantityOption = selectedOption.dataset.qoption;

    // Add the new product to the state
    setInDocket({
      ...inDocket,
      products: [
        ...(inDocket.products ?? []),
        {
          id: parseInt(id),
          code,
          name,
          orderedProductQuantity,
          receivedProductQuantity,
          quantityOption: {
            id: parseInt(quantityOption),
            quantityOption: 'pak' // Replace this with the actual quantity option
          },

          inDocketId: inDocket.id || 0,
          productId: parseInt(id)
        }
      ]
    });

    // Hide the form

    setIsAddingProduct(false);
  };
  React.useEffect(() => {
    console.log(inDocket);
  }, [inDocket]);
  return (
    <div className="big-modal">
      <button className="close-button" onClick={onClose}>
        Sulje
      </button>
      <div className="big-modal-header">
        <h2>Lisää saapumiserä</h2>
      </div>
      <div className="big-modal-content">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="in-docket-number">Saapumiserän numero</label>
            <input
              value={inDocket?.docketNumber}
              type="text"
              id="in-docket-number"
              onChange={(e) =>
                setInDocket({
                  ...inDocket,
                  docketNumber: e.target.value
                })
              }
            />
          </div>
          <div>
            <label htmlFor="in-docket-date">Saapumiserän päivämäärä</label>
            <input
              value={
                inDocket.arrivedAt
                  ? new Date(inDocket.arrivedAt).toISOString().split('T')[0]
                  : ''
              }
              type="date"
              id="in-docket-date"
              onChange={(e) =>
                setInDocket({
                  ...inDocket,
                  arrivedAt: new Date(e.target.value)
                })
              }
            />
          </div>
          <div>
            <label htmlFor="in-docket-vendor">Toimittaja</label>
            <select
              onChange={(e) => {
                const vendorId = e.target.value;
                const vendor = vendors.find((v) => v.id === parseInt(vendorId));
                if (vendor) {
                  setInDocket({
                    ...inDocket,
                    vendor: {
                      id: vendor.id,
                      name: vendor.name
                    }
                  });
                }
              }}
            >
              <option value="">Valitse toimittaja</option>
              {Array.isArray(vendors) &&
                vendors.map((vendor) => {
                  return (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  );
                })}
            </select>
          </div>
          <div>
            {inDocket.products && (
              <table className="modal-table">
                <thead>
                  <tr>
                    <th>Tuotenumero</th>
                    <th>Tuote</th>
                    <th>Toimitettu Määrä</th>
                    <th>Tilattu määrä</th>
                    <th>Yksikkö</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {inDocket?.products?.map((product) => {
                    if (!product || product.id === undefined) {
                      return null;
                    }
                    return (
                      <tr key={product.id}>
                        <td>{product.code}</td>
                        <td>{product.name}</td>
                        <td>
                          <input
                            min={0}
                            max={product.orderedProductQuantity}
                            value={product.receivedProductQuantity}
                            onChange={(e) => {
                              setInDocket({
                                ...inDocket,
                                products: inDocket?.products?.map((p) => {
                                  if (p.id === product.id) {
                                    return {
                                      ...p,
                                      receivedProductQuantity: Number(
                                        e.target.value
                                      )
                                    };
                                  }
                                  return p;
                                })
                              });
                            }}
                            type="number"
                          ></input>
                        </td>
                        <td>
                          <input
                            type="number"
                            min={0}
                            value={product.orderedProductQuantity}
                            onChange={(e) => {
                              setInDocket({
                                ...inDocket,
                                products: inDocket?.products?.map((p) => {
                                  if (p.id === product.id) {
                                    return {
                                      ...p,
                                      orderedProductQuantity: Number(
                                        e.target.value
                                      )
                                    };
                                  }
                                  return p;
                                })
                              });
                            }}
                          ></input>
                        </td>
                        <td>{product.quantityOption?.quantityOption}</td>
                        <td>
                          <button onClick={() => removeProduct(product)}>
                            Poista
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            <button type="button" onClick={addProduct}>
              Lisää tuote
            </button>
          </div>
          <button type="submit">Lisää saapumiserä</button>
        </form>
        {isAddingProduct && (
          <div>
            <h2>Lisää uusi tuote</h2>
            <form onSubmit={handleAddProduct}>
              <select>
                {Array.isArray(products) &&
                  products.map((product) => {
                    return (
                      <option
                        key={product.id}
                        value={product.id}
                        data-code={product.code}
                        data-name={product.name}
                        data-qoption={product.quantityOptionId}
                      >
                        {product.code} - {product.name}
                      </option>
                    );
                  })}
              </select>
              <label>
                Tilattu määrä:
                <input type="number" name="orderedProductQuantity" />
              </label>
              <label>
                Toimitettu määrä:
                <input type="number" name="receivedProductQuantity" />
              </label>

              <input type="submit" value="Lisää tuote" />
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddInDocketModal;
