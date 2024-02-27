import React from 'react';
import { OutDocket } from '../intefaces/OutDocket';
import { useOutDockets, useProducts } from '../hooks/ApiHooks';
import { TransportOption } from '../intefaces/TransportOption';
import { Product } from '../intefaces/Product';

export interface EditOutDocketProps {
  outDocket: OutDocket;
  stateChanger: (
    updateFunction: (prevDockets: OutDocket[]) => OutDocket[]
  ) => void;
  onClose: () => void;
}

const EditOutDocket: React.FC<EditOutDocketProps> = ({
  outDocket,
  stateChanger,
  onClose
}) => {
  const { getTransportOptions, putOutDocket } = useOutDockets();
  const { getProducts } = useProducts();
  const [transportOptions, setTransportOptions] = React.useState([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [outDocketState, setOutDocketState] =
    React.useState<OutDocket>(outDocket);
  const [file, setFile] = React.useState<File | null>(null);
  const [isAddingProduct, setIsAddingProduct] = React.useState(false);
  console.log('outDocket', outDocketState);
  React.useEffect(() => {
    (async () => {
      try {
        const transportOptions = await getTransportOptions();
        setTransportOptions(transportOptions);
        const products = await getProducts();
        setProducts(products);
      } catch (e) {
        console.error(e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submit');
    const data = {
      docketNumber: outDocketState.docketNumber,
      clientId: outDocketState.client.id,
      departureAt: outDocketState.departureAt,
      transportOptionId: outDocketState.transportOptionId,
      products: outDocketState.products,
      filename: file
    };
    console.log(data);
    const updatedDocket = await putOutDocket(outDocket.id, data);
    if (updatedDocket) {
      stateChanger((prevDockets) => {
        return prevDockets.map((docket) => {
          if (docket.id === updatedDocket.id) {
            return updatedDocket;
          }
          return docket;
        });
      });
      onClose();
    }
  };

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
    const deliveredProductQuantity = form.deliveredProductQuantity.value;
    const quantityOption = selectedOption.dataset.qoption;

    // Add the new product to the state
    setOutDocketState({
      ...outDocketState,
      products: [
        ...(outDocketState.products ?? []),
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

          outDocketId: outDocketState.id,
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
        <h3>Muokkaa lähete</h3>
      </div>
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="docketNumber">Lähetteen numero</label>
            <input
              type="text"
              id="docketNumber"
              value={outDocketState.docketNumber}
              onChange={(e) => {
                setOutDocketState({
                  ...outDocketState,
                  docketNumber: e.target.value
                });
              }}
            ></input>
          </div>
          <div>
            <label htmlFor="client">Asiakas</label>
            <select
              id="client"
              value={outDocketState.client.id.toString()}
              onChange={(e) => {
                setOutDocketState({
                  ...outDocketState,
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
              value={
                outDocketState.departureAt
                  ? new Date(outDocketState.departureAt)
                      .toISOString()
                      .slice(0, 10)
                  : ''
              }
              id="departureAt"
              onChange={(e) => {
                setOutDocketState({
                  ...outDocketState,
                  departureAt: new Date(e.target.value)
                });
              }}
            ></input>
          </div>
          <div>
            <label htmlFor="transportOption">Kuljetusmuoto</label>
            <select
              id="transportOption"
              value={outDocketState.transportOptionId.toString()}
              onChange={(e) => {
                setOutDocketState({
                  ...outDocketState,
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
                  {outDocketState?.products?.map((product) => {
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
                            value={product.deliveredProductQuantity ?? 0}
                            onChange={(e) => {
                              setOutDocketState({
                                ...outDocketState,
                                products: outDocketState?.products?.map((p) => {
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
                            value={product.orderedProductQuantity}
                            min={0}
                            onChange={(e) => {
                              setOutDocketState({
                                ...outDocketState,
                                products: outDocketState?.products?.map((p) => {
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
              <label>
                Toimitettu määrä:
                <input type="number" name="deliveredProductQuantity" />
              </label>

              <input type="submit" value="Lisää tuote" />
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditOutDocket;
