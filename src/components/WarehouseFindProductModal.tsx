import React from 'react';
import { useProducts } from '../hooks/ApiHooks';
import { SpotProps } from './Spot';

export interface WarehouseFindProductModalProps {
  onClose: () => void;
  productCode: string;
}

const WarehouseFindProductModal: React.FC<WarehouseFindProductModalProps> = ({
  onClose,
  productCode
}) => {
  const { getSpotsByProductCode } = useProducts();
  const [spots, setSpots] = React.useState<SpotProps[]>([]);
  const handleClick = () => {
    onClose();
  };
  React.useEffect(() => {
    const fetchSpots = async () => {
      if (productCode === '') {
        return;
      }
      const spots = await getSpotsByProductCode(productCode);
      console.log('Spots', spots);
      setSpots(spots);
    };
    fetchSpots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productCode]);
  return (
    <div className="modal">
      <button className="close-button" onClick={handleClick}>
        Sulje
      </button>
      <div className="modal-content">
        <h3>Tuote: {productCode} </h3>
        <table className="pallets-table">
          <tbody>
            <tr>
              <th>Rivi</th>
              <th>Väli</th>
              <th>Paikka</th>
              <th>Tulopvm</th>
              <th>Viimeisin muutos</th>
            </tr>
            {spots &&
              spots.map((spot) => {
                return (
                  <tr key={spot.id}>
                    <td>{spot.gap?.row.rowNumber}</td>
                    <td>{spot.gap?.gapNumber}</td>
                    <td>{spot.spotNumber}</td>
                    <td>
                      {spot.pallet?.createdAt
                        ? new Date(spot.pallet.createdAt).toLocaleDateString(
                            'fi-FI'
                          )
                        : 'N/A'}
                    </td>
                    <td>
                      {spot.pallet?.updatedAt
                        ? new Date(spot.pallet.updatedAt).toLocaleDateString(
                            'fi-FI'
                          )
                        : 'N/A'}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WarehouseFindProductModal;
