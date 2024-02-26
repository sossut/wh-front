import React from 'react';
import { OutDocket } from '../intefaces/OutDocket';
import { useOutDockets } from '../hooks/ApiHooks';
import { TransportOption } from '../intefaces/TransportOption';

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
  console.log('outDocket', outDocket);
  const { getTransportOptions, putOutDocket } = useOutDockets();
  const [transportOptions, setTransportOptions] = React.useState([]);
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

  const updateProduct = (id: number, value: number) => {
    console.log(id, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submit');
    const data = {
      docketNumber: outDocket.docketNumber,
      clientId: outDocket.client.id,
      departureAt: outDocket.departureAt,
      transportOptionId: outDocket.transportOptionId
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
  return (
    <div className="modal">
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
              value={outDocket.docketNumber}
              onChange={() => {}}
            ></input>
          </div>
          <div>
            <label htmlFor="client">Asiakas</label>
            <select
              id="client"
              value={outDocket.client.id.toString()}
              onChange={() => {}}
            >
              <option value="1">Testiasiakas</option>
            </select>
          </div>
          <div>
            <label htmlFor="departureAt">Lähtöaika</label>
            <input
              type="date"
              value={
                outDocket.departureAt
                  ? new Date(outDocket.departureAt).toISOString().slice(0, 10)
                  : ''
              }
              id="departureAt"
              onChange={() => {}}
            ></input>
          </div>
          <div>
            <label htmlFor="transportOption">Kuljetusmuoto</label>
            <select
              id="transportOption"
              value={outDocket.transportOptionId.toString()}
              onChange={() => {}}
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
            <input type="file" id="file"></input>
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
                  </tr>
                </thead>
                <tbody>
                  {outDocket.products.map((product) => {
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
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          <button type="submit">Tallenna</button>
        </form>
      </div>
    </div>
  );
};

export default EditOutDocket;
