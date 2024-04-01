import React from 'react';
import { InDocket } from '../intefaces/InDocket';
import { useInDockets } from '../hooks/ApiHooks';

export interface EditInDocketModalProps {
  onClose: () => void;
  stateChange: (
    updateFunction: (prevDockets: InDocket[]) => InDocket[]
  ) => void;
  inDocket: InDocket;
}

const EditInDocketModal: React.FC<EditInDocketModalProps> = ({
  onClose,
  inDocket,
  stateChange
}) => {
  const [inDocketState, setInDocketState] = React.useState<InDocket>(inDocket);
  React.useEffect(() => {
    setInDocketState(inDocket);
  }, [inDocket]);
  const { putInDocket, deleteInDocket, getInDocket } = useInDockets();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await putInDocket(inDocket.id as number, inDocketState as InDocket);
    const newInDocket = await getInDocket(inDocket.id as number);
    stateChange((prevDockets) => {
      return prevDockets.map((d) => {
        if (d.id === inDocket.id) {
          return newInDocket;
        }
        return d;
      });
    });
  };
  const handleDelete = async () => {
    const del = await deleteInDocket(inDocket.id as number);
    if (!del) {
      return;
    }
    stateChange((prevDockets) => {
      return prevDockets.filter((d) => d.id !== inDocket.id);
    });
  };
  return (
    <div className="big-modal">
      <button className="close-button" onClick={onClose}>
        Sulje
      </button>
      <h2>Muokkaa saapumiserää</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="in-docket-number">Saapumiserän numero</label>
          <input
            type="text"
            id="in-docket-number"
            value={inDocketState.docketNumber}
            onChange={(e) =>
              setInDocketState({
                ...inDocketState,
                docketNumber: e.target.value
              })
            }
          />
        </div>
        <div>
          <label htmlFor="in-docket-date">Saapumiserän päivämäärä</label>
          <input
            type="date"
            id="in-docket-date"
            value={
              inDocketState.arrivedAt
                ? new Date(
                    new Date(inDocketState.arrivedAt).setHours(
                      new Date(inDocketState.arrivedAt).getHours() + 2
                    )
                  )
                    .toISOString()
                    .split('T')[0]
                : 'N/A'
            }
            onChange={(e) =>
              setInDocketState({
                ...inDocketState,
                arrivedAt: new Date(e.target.value)
              })
            }
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>Koodi</th>
              <th>Tuote</th>
              <th>Saapunut määrä</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(inDocketState.products) &&
              inDocketState.products.map((product) => (
                <tr key={product.id}>
                  <td>{product.code}</td>
                  <td>{product.name}</td>
                  <td>
                    <input
                      type="number"
                      value={product.receivedProductQuantity}
                      onChange={(e) => {
                        setInDocketState((prev) => {
                          return {
                            ...prev,
                            products: prev.products.map((p) => {
                              if (p.id === product.id) {
                                return {
                                  ...p,
                                  arrivedProductQuantity: Number(e.target.value)
                                };
                              }
                              return p;
                            })
                          };
                        });
                      }}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <button type="submit">Tallenna</button>
      </form>
      <button type="button" onClick={handleDelete}>
        Poista Lähete
      </button>
    </div>
  );
};

export default EditInDocketModal;
