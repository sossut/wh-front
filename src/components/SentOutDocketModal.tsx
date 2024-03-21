import React from 'react';
import { SentOutDocket } from '../intefaces/SentOutDocket';
import { Client } from '../intefaces/Client';

export interface SentOutDocketModalProps {
  onClose: () => void;
  updateState: (
    updateFunction: (prevDockets: SentOutDocket[]) => SentOutDocket[]
  ) => void;
  sentOutDocket: SentOutDocket;
}

const SentOutDocketModal: React.FC<SentOutDocketModalProps> = ({
  onClose,
  updateState,
  sentOutDocket
}) => {
  return (
    <div className="big-modal">
      <button className="close-button" onClick={onClose}></button>
      <div className="big-modal-header">
        <h3>
          {sentOutDocket.departureAt + sentOutDocket.outDocket.docketNumber}
        </h3>
        <div className="big-modal-header-content">
          <div className="big-modal-header-client">
            <p>{(sentOutDocket.client as Client).name}</p>
          </div>
          <div className="big-modal-header-date">
            <p>
              Lähetetty{' '}
              {new Date(sentOutDocket.createdAt).toLocaleDateString('FI-fi')}
            </p>
            <p>
              Toimitustapa{' '}
              {sentOutDocket.transportOption.transportOption
                ? sentOutDocket.transportOption.transportOption
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>
      <div className="big-modal-content">
        <div>
          <h4>Lähetys</h4>
          <table>
            <thead>
              <tr>
                <th>Koodi</th>
                <th>Tuote</th>
                <th>Tilattu määrä</th>
                <th>Toimitettu määrä</th>
              </tr>
            </thead>
            <tbody>
              {sentOutDocket.products.map((product) => (
                <tr key={product.id}>
                  <td>{product.code}</td>
                  <td>{product.name}</td>
                  <td>{product.orderedProductQuantity}</td>
                  <td>{product.deliveredProductQuantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SentOutDocketModal;
