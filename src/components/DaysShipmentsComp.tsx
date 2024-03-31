import React from 'react';
import { useOutDockets } from '../hooks/ApiHooks';
import { DaysShipments } from '../intefaces/DaysShipments';

import { OutDocket } from '../intefaces/OutDocket';

const DaysShipmentsComp = () => {
  const { getDaysShipments } = useOutDockets();
  const [daysShipments, setDaysShipments] = React.useState<DaysShipments[]>([]);

  React.useEffect(() => {
    (async () => {
      const daysShipments = await getDaysShipments();
      Array.isArray(daysShipments) &&
        setDaysShipments(
          daysShipments.sort((a, b) =>
            b.departedAt.toString().localeCompare(a.departedAt.toString())
          )
        );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <h2>Päivän lähetykset</h2>
      <table>
        <thead>
          <tr>
            <th>Lähtöaika</th>

            <th>Lähetteet</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(daysShipments) &&
            daysShipments &&
            daysShipments.map((daysShipment) => (
              <tr key={daysShipment.id}>
                <td>
                  {new Date(daysShipment.departedAt).toLocaleDateString(
                    'fi-Fi'
                  )}
                </td>
                <td>
                  {daysShipment.json &&
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    JSON.parse(daysShipment.json).map(
                      (outDocket: OutDocket) => {
                        return (
                          <tr key={outDocket.id}>
                            <td>{outDocket.docketNumber}</td>

                            <td>
                              {typeof outDocket.products === 'string' ? (
                                <div>{outDocket.products}</div>
                              ) : (
                                outDocket.products?.map((product, index) => (
                                  <div key={index}>
                                    {product.code}{' '}
                                    {product.deliveredProductQuantity} /{' '}
                                    {product.orderedProductQuantity}
                                  </div>
                                ))
                              )}
                            </td>
                          </tr>
                        );
                      }
                    )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default DaysShipmentsComp;
