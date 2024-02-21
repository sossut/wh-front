import React from 'react';
import { OutDocket } from '../intefaces/OutDocket';
import { TransportOption } from '../intefaces/TransportOption';

export interface FullOutDocketModalProps {
  onClose: () => void;
  outDocket: OutDocket;
}

const FullOutDocketModal: React.FC<FullOutDocketModalProps> = ({
  onClose,
  outDocket
}) => {
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
        <table className="big-modal-table">
          <thead className="big-modal-thead">
            <tr>
              <th>Tuotenumero</th>
              <th>Tuote</th>
              <th>Toimitettu Määrä</th>
              <th>Tilattu määrä</th>
              <th>Yksikkö</th>
            </tr>
          </thead>
          <tbody>
            {outDocket.products &&
              outDocket.products.map((product) => {
                console.log(
                  'orderedProductQuantity',
                  product.orderedProductQuantity
                );
                return (
                  <tr key={product.id}>
                    <td>{product.code}</td>
                    <td>{product.name}</td>
                    <td>{product.deliveredProductQuantity}</td>
                    <td>{product.orderedProductQuantity}</td>
                    <td>{product.quantityOption?.quantityOption}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <button>Kerätty</button>
      </div>
    </div>
  );
};

export default FullOutDocketModal;
