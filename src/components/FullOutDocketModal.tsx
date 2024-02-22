import React from 'react';
import { OutDocket } from '../intefaces/OutDocket';
import { TransportOption } from '../intefaces/TransportOption';
import { useOutDockets } from '../hooks/ApiHooks';

export interface FullOutDocketModalProps {
  onClose: () => void;
  outDocket: OutDocket;
}

const FullOutDocketModal: React.FC<FullOutDocketModalProps> = ({
  onClose,
  outDocket
}) => {
  const [collectedQuantities, setCollectedQuantities] = React.useState<{[key: number]: number}>({});
  const {postSentOutDocket} = useOutDockets();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submit');
    console.log(collectedQuantities);
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
  const handleChange = (productId: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setCollectedQuantities({
      ...collectedQuantities,
      [productId]: parseInt(e.target.value)
    });
  };
  console.log(outDocket);
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
                  console.log(
                    'orderedProductQuantity',
                    product.orderedProductQuantity
                  );
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
                        <input
                          min={0}
                          max={product.orderedProductQuantity}
                          onChange={handleChange(product.id)}
                          type="number"
                        ></input>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <button>Lähetä</button>
        </form>
      </div>
    </div>
  );
};

export default FullOutDocketModal;
