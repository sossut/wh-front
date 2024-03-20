import React from 'react'
import { InDocket } from '../intefaces/InDocket';
import { useInDockets, useProducts } from '../hooks/ApiHooks';
import { Product } from '../intefaces/Product';

export interface AddInDocketModalProps {
  onClose: () => void;
  stateChange:(
    updateFunction: (prevDockets: InDocket[]) => InDocket[]
  ) => void;
}

const AddInDocketModal: React.FC<AddInDocketModalProps> = ({onClose, stateChange}) => {
  const [inDocket, setInDocket] = React.useState<InDocket>({
    docketNumber: '',
    arrivalAt: new Date(),
    vendor: {
      id: 0,
      name: ''
    },
    products: []
  });
  const [isAddingProduct, setIsAddingProduct] = React.useState(false);
  const [products, setProducts] = React.useState<Product[]>([]);
  const {postInDocket, getInDocket} = useInDockets();
  const {getProducts} = useProducts();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = await postInDocket(inDocket);
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
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const addProduct = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setIsAddingProduct(true);
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
    const deliveredProductQuantity = 0;
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
          deliveredProductQuantity,
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
  

  return (
    <div className='big-modal'>
      <button className='close-button' onClick={onClose}>
        Sulje
      </button>
      <div className='big-modal-header'>
        <h2>Lisää saapumiserä</h2>
        
      </div>
      <div className='big-modal-content'>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='in-docket-number'>Saapumiserän numero</label>
          <input value={inDocket?.docketNumber} type='text' id='in-docket-number' onChange={
            (e) => setInDocket({
              ...inDocket,
              docketNumber: e.target.value
            })
          } />
          
        </div>
        <div>
          <label htmlFor='in-docket-date'>Saapumiserän päivämäärä</label>
          <input value={inDocket.arrivalAt ? new Date(inDocket.arrivalAt).toLocaleDateString('FI-fi') : ''} type='date' id='in-docket-date' onChange={
            (e) => setInDocket({
              ...inDocket,
              arrivalAt: new Date(e.target.value)
            })
          
          }/>
        </div>
        <div>
          <label htmlFor='in-docket-vendor'>Toimittaja</label>
          <select>
            <option value=''>Valitse toimittaja</option>
            
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
                            onChange={(e) => {
                              setInDocket({
                                ...inDocket,
                                products: inDocket?.products?.map((p) => {
                                  if (p.id === product.id) {
                                    return {
                                      ...p,
                                      deliveredProductQuantity: Number(
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
                          <button>Poista</button>
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

              <input type="submit" value="Lisää tuote" />
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default AddInDocketModal