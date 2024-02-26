import React from 'react';
import { OutDocket } from '../intefaces/OutDocket';
import { TransportOption } from '../intefaces/TransportOption';
import { useOutDockets } from '../hooks/ApiHooks';

export interface FullOutDocketModalProps {
  onClose: () => void;
  outDocket: OutDocket;
  stateChanger: (
    updateFunction: (prevDockets: OutDocket[]) => OutDocket[]
  ) => void;
}

const FullOutDocketModal: React.FC<FullOutDocketModalProps> = ({
  onClose,
  outDocket,
  stateChanger
}) => {
  const [collectedQuantities, setCollectedQuantities] = React.useState<{
    [key: number]: number;
  }>({});
  const [parcelQuantity, setParcelQuantity] = React.useState<number>(0);
  const [transportOptions, setTransportOptions] = React.useState<
    TransportOption[]
  >([]);
  const [departureAt, setDepartureAt] = React.useState<Date | null>(
    outDocket.departureAt ? new Date(outDocket.departureAt) : null
  );
  const [transportOption, setTransportOption] = React.useState<number>(
    outDocket.transportOptionId as number
  );
  const { postSentOutDocket, getTransportOptions } = useOutDockets();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submit');
    console.log(collectedQuantities);
    const data = {
      docketId: outDocket.id,
      products: Object.keys(collectedQuantities).map((key) => {
        return {
          productId: parseInt(key),
          deliveredProductQuantity: collectedQuantities[parseInt(key)]
        };
      }),
      parcels: parcelQuantity,
      transportOptionId: transportOption,
      departureAt: departureAt
    };
    console.log(data);
    const sod = await postSentOutDocket(data);

    if (sod) {
      stateChanger((prevDockets) => {
        return prevDockets.map((docket) => {
          const newDocket = { ...docket };
          newDocket.products = docket.products?.map((product) => {
            for (const key in collectedQuantities) {
              if (product.id === Number(key)) {
                return {
                  ...product,
                  deliveredProductQuantity:
                    (product.deliveredProductQuantity || 0) +
                    collectedQuantities[key]
                };
              }
            }
            // Always return a product, even if it wasn't updated
            return product;
          });
          return newDocket;
        });
      });
      onClose();
    }
  };
  React.useEffect(() => {
    const initialQuantities = outDocket?.products?.reduce((acc, product) => {
      if (!product || product.id === undefined) {
        return acc;
      }
      return {
        ...acc,
        [product.id]: product.deliveredProductQuantity
      };
    }, {});
    if (!initialQuantities) {
      return;
    }
    setCollectedQuantities(initialQuantities);
  }, [outDocket.products]);

  React.useEffect(() => {
    (async () => {
      try {
        const transportOptions = await getTransportOptions();
        setTransportOptions(transportOptions);
      } catch (e) {
        console.error(e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleQuantityChange =
    (productId: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(e.target.value);
      setCollectedQuantities({
        ...collectedQuantities,
        [productId]: parseInt(e.target.value)
      });
      console.log(collectedQuantities);
    };
  const handleParcelQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(e.target.value);
    setParcelQuantity(parseInt(e.target.value));
    if (e.target.value === '') {
      setParcelQuantity(0);
    }
    if (parseInt(e.target.value) < 0) {
      setParcelQuantity(0);
    }
  };
  const handleTransportChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    setTransportOption(parseInt(e.target.value));
  };

  const handleDepartureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setDepartureAt(new Date(e.target.value));
  };
  return (
    <div className="big-modal">
      <button className="close-button" onClick={onClose}>
        Sulje
      </button>
      <div className="big-modal-header">
        <h3>Lähete {outDocket.docketNumber}</h3>
        <div className="big-modal-header-content">
          <div className="big-modal-header-client">
            <p>
              Asiakas <strong>{outDocket.client?.name}</strong>
            </p>
            <p>
              Osoite{' '}
              <strong>
                {/* {outDocket.client?.address} {outDocket.client?.city} */}
                Tähän asiakkaan osoite
              </strong>
            </p>
          </div>
          <div className="big-modal-header-date">
            <p>
              Päivämäärä{' '}
              {new Date(outDocket.createdAt).toLocaleDateString('FI-fi')}
            </p>
            <p>
              Toimituspäivä{' '}
              {outDocket.departureAt
                ? new Date(outDocket.departureAt).toLocaleDateString('FI-fi')
                : 'N/A'}
            </p>
            <p>
              Toimitustapa{' '}
              <strong>
                {(outDocket.transportOption as TransportOption).transportOption}
              </strong>
            </p>
          </div>
        </div>
      </div>
      <div className="big-modal-content">
        <form onSubmit={handleSubmit}>
          <table className="big-modal-table">
            <thead className="big-modal-thead">
              <tr>
                <th>Tuotenumero</th>
                <th>Tuote</th>
                <th>Toimitettu Määrä</th>
                <th>Tilattu määrä</th>
                <th>Yksikkö</th>
                <th>Kerätty määrä</th>
              </tr>
            </thead>
            <tbody>
              {outDocket.products &&
                outDocket.products.map((product) => {
                  if (!product || product.id === undefined) {
                    return null;
                  }
                  return (
                    <tr key={product.id}>
                      <td>{product.code}</td>
                      <td>{product.name}</td>
                      <td>{product.deliveredProductQuantity}</td>
                      <td>{product.orderedProductQuantity}</td>
                      <td>{product.quantityOption?.quantityOption}</td>
                      <td>
                        {(product.orderedProductQuantity !=
                          product.deliveredProductQuantity && (
                          <input
                            min={0}
                            max={product.orderedProductQuantity}
                            onChange={handleQuantityChange(product.id)}
                            type="number"
                          ></input>
                        )) ||
                          'täysimääräinen'}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <select onChange={handleTransportChange}>
            {transportOptions.map((option) => {
              return (
                <option
                  key={option.id}
                  selected={option.id === transportOption}
                  value={option.id}
                >
                  {option.transportOption}
                </option>
              );
            })}
          </select>
          <input
            onChange={handleParcelQuantityChange}
            type="number"
            placeholder="Pakettien määrä"
          ></input>
          <input
            type="date"
            placeholder="Toimituspäivä"
            onChange={handleDepartureChange}
          ></input>
          <button>Lähetä</button>
        </form>
      </div>
    </div>
  );
};

export default FullOutDocketModal;
