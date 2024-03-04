import React from 'react';
import { OutDocket } from '../intefaces/OutDocket';
import { useOutDockets, useProducts } from '../hooks/ApiHooks';
import { TransportOption } from '../intefaces/TransportOption';
import { Product } from '../intefaces/Product';

export interface AddOutDocketModalProps {
  onClose: () => void;
  stateChanger: (
    updateFunction: (prevDockets: OutDocket[]) => OutDocket[]
  ) => void;
}

const AddOutDocketModal: React.FC<AddOutDocketModalProps> = ({
  onClose,
  stateChanger
}) => {
  const [outDocket, setOutDocket] = React.useState<OutDocket>({
    docketNumber: '',
    departureAt: null,
    updatedAt: new Date(),
    transportOptionId: 1, // Replace this with the actual transport option id
    status: 'open',
    clientId: 1, // Replace this with the actual client id
    products: []
  });
  const { getTransportOptions, getOutDocket, postOutDocket } = useOutDockets();
  const { getProducts } = useProducts();
  const [transportOptions, setTransportOptions] = React.useState<
    TransportOption[]
  >([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [file, setFile] = React.useState<File | null>(null);
  const [isAddingProduct, setIsAddingProduct] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submit');
    console.log(outDocket);
    const data = {
      docketNumber: outDocket.docketNumber,
      departureAt: outDocket.departureAt,
      transportOptionId: outDocket.transportOptionId,
      clientId: outDocket.client?.id,
      products: outDocket.products
    };
    const postDocket = await postOutDocket(data);
    const newDocket = await getOutDocket(postDocket.id);

    stateChanger((prevDockets) => {
      return [...prevDockets, newDocket];
    });

    onClose();
  };

  React.useEffect(() => {
    (async () => {
      const transportOptions = await getTransportOptions();
      setTransportOptions(transportOptions);
      const products = await getProducts();
      setProducts(products);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    console.log('outDocket', outDocket);
  }, [outDocket]);

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
    setOutDocket({
      ...outDocket,
      products: [
        ...(outDocket.products ?? []),
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

          outDocketId: outDocket.id || 0,
          productId: parseInt(id)
        }
      ]
    });

    // Hide the form

    setIsAddingProduct(false);
  };

  return (
    <div className="big-modal">
      <button className="close-button" onClick={onClose}>
        Sulje
      </button>
      <div className="modal-header">
        <h3>Luo lähete</h3>
      </div>
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="docketNumber">Lähetteen numero</label>
            <input
              type="text"
              id="docketNumber"
              onChange={(e) => {
                setOutDocket({
                  ...outDocket,
                  docketNumber: e.target.value
                });
              }}
            ></input>
          </div>
          <div>
            <label htmlFor="client">Asiakas</label>
            <select
              id="client"
              onChange={(e) => {
                setOutDocket({
                  ...outDocket,
                  client: {
                    id: Number(e.target.value),
                    name: String(e.target.options[e.target.selectedIndex].text)
                  }
                });
              }}
            >
              <option value="1">Testiasiakas</option>
            </select>
          </div>
          <div>
            <label htmlFor="departureAt">Lähtöaika</label>
            <input
              type="date"
              id="departureAt"
              onChange={(e) => {
                setOutDocket({
                  ...outDocket,
                  departureAt: new Date(e.target.value)
                    .toISOString()
                    .split('T')[0]
                });
              }}
            ></input>
          </div>
          <div>
            <label htmlFor="transportOption">Kuljetusmuoto</label>
            <select
              id="transportOption"
              onChange={(e) => {
                setOutDocket({
                  ...outDocket,
                  transportOptionId: Number(e.target.value)
                });
              }}
            >
              {transportOptions.map((option: TransportOption) => (
                <option key={option.id} value={option.id}>
                  {option.transportOption}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="file">Lisää tiedosto</label>
            <input
              type="file"
              id="file"
              onChange={(e) => {
                if (e.target.files) {
                  setFile(e.target.files[0]);
                }
              }}
            ></input>
          </div>
          <div>
            {outDocket.products && (
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
                  {outDocket?.products?.map((product) => {
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
                              setOutDocket({
                                ...outDocket,
                                products: outDocket?.products?.map((p) => {
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
                              setOutDocket({
                                ...outDocket,
                                products: outDocket?.products?.map((p) => {
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
          <button type="submit">Tallenna</button>
        </form>
        {isAddingProduct && (
          <div>
            <h2>Lisää uusi tuote</h2>
            <form onSubmit={handleAddProduct}>
              <select>
                {products.map((product) => {
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
  );
};

export default AddOutDocketModal;
