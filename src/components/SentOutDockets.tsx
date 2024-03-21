import React from 'react';
import { SentOutDocket } from '../intefaces/SentOutDocket';
import { useOutDockets } from '../hooks/ApiHooks';

export interface SentOutDocketsProps {
  updateState: (
    updateFunction: (prevDockets: SentOutDocket[]) => SentOutDocket[]
  ) => void;
  sentOutDockets: SentOutDocket[];
}

const SentOutDockets: React.FC<SentOutDocketsProps> = ({
  updateState,
  sentOutDockets
}) => {
  const [outDocket, setOutDocket] = React.useState<SentOutDocket | null>(null);

  const checkDocket =
    (docket: SentOutDocket) =>
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      console.log('check docket', docket);
      setOutDocket(docket);
    };

  const sortDockets = (dockets: SentOutDocket[]) => {
    if (!Array.isArray(dockets)) {
      console.error('sortDockets was called with a non-array value:', dockets);
      return [];
    }
    return dockets.sort((a, b) =>
      b.departureAt.toString().localeCompare(a.departureAt.toString())
    );
  };

  React.useEffect(() => {
    (async () => {
      sortDockets(sentOutDockets);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentOutDockets]);

  return (
    <div className="common-body">
      <div className="common-header">
        <h1>Lähteneet Lähetetykset</h1>
      </div>
      <table className="common-table">
        <thead>
          <tr>
            <th>Lähtöaika</th>
            <th>Lähetenumero</th>
            <th>Kuljetusmuoto</th>
            <th>Parcels</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(sentOutDockets) &&
            sentOutDockets &&
            sentOutDockets.map((sentOutDocket) => (
              <tr key={sentOutDocket.id}>
                <td>
                  {new Date(sentOutDocket.departureAt).toLocaleDateString(
                    'FI-fi'
                  )}
                </td>
                <td>{sentOutDocket.outDocket.docketNumber}</td>
                <td>{sentOutDocket.transportOption.transportOption}</td>
                <td>{sentOutDocket.parcels}</td>
                <td>
                  <button onClick={() => checkDocket(sentOutDocket)}>
                    Tarkastele
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default SentOutDockets;
