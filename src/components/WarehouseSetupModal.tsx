import React from 'react';
import { useWarehouse } from '../hooks/ApiHooks';
import { RowProps } from './Row';
import { GapProps } from './Gap';

export interface WarehouseSetupModalProps {
  onClose: () => void;
  warehouse: RowProps[];
}

const WarehouseSetupModal: React.FC<WarehouseSetupModalProps> = ({
  onClose,
  warehouse
}) => {
  const { postSpots } = useWarehouse();
  const [numberOfRows, setNumberOfRows] = React.useState(0);
  const [isReady, setIsReady] = React.useState(false);
  const [rows, setRows] = React.useState(Array(numberOfRows).fill(0));
  // const [selectedRow, setSelectedRow] = React.useState<number | null>(null);
  // const [gaps, setGaps] = React.useState(() => {
  //   const initialGaps = [];
  //   for (let i = 0; i < numberOfRows; i++) {
  //     initialGaps[i] = [{ spots: 0 }];
  //   }
  //   return initialGaps;
  // });
  const [numberOfSpotsOnGaps, setNumberOfSpotsOnGaps] = React.useState(0);
  const handleClick = () => {
    onClose();
  };
  React.useEffect(() => {
    setNumberOfRows(warehouse.length);
    if (warehouse.length > 0) {
      setIsReady(true);
    }
    const spots = (warehouse[0]?.data?.[0] as GapProps | undefined)?.data
      ?.length;
    setNumberOfSpotsOnGaps(spots || 0);
  }, [warehouse]);

  const handleNumberOfRowsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const howManyRows = parseInt(event.target.value);

    if (
      Number.isSafeInteger(howManyRows) &&
      howManyRows >= 0 &&
      howManyRows <= 20
    ) {
      setNumberOfRows(howManyRows);
      setRows(Array(howManyRows).fill(0));
    } else {
      // handle invalid input
    }
  };

  const handleNumberOfSpotsOnGapsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const howManySpots = parseInt(event.target.value);
    if (
      Number.isSafeInteger(howManySpots) &&
      howManySpots >= 0 &&
      howManySpots <= 20
    ) {
      setNumberOfSpotsOnGaps(howManySpots);
    } else {
      // handle invalid input
    }
  };

  const handleRowsChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const mewRows = [...rows];
      mewRows[index] = parseInt(event.target.value);
      setRows(mewRows);
    };
  // const editRow =
  //   (index: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
  //     // Your code here
  //     event.preventDefault();
  //     setSelectedRow(index);
  //   };

  const handleEnable = () => {
    setIsReady(false);
  };
  const handleSubmit = () => {
    console.log('Rows', rows);
    const obj = {
      data: rows.map((row, rowIndex) => ({
        rowNumber: rowIndex + 1,
        gaps: row,
        data: Array(row)
          .fill(0)
          .map((_, gapIndex) => ({
            gapNumber: gapIndex + 1,
            spots: numberOfSpotsOnGaps,
            data: Array(numberOfSpotsOnGaps)
              .fill(0)
              .map((_, spotIndex) => ({
                spotNumber: spotIndex + 1
              }))
          }))
      }))
    };
    console.log('obj', obj);
    postSpots(obj);
  };
  // React.useEffect(() => {
  //   console.log('Rows', rows);
  //   console.log('Number of spots on gaps', numberOfSpotsOnGaps);
  // }, [rows, numberOfSpotsOnGaps]);
  return (
    <div className="modal">
      <button className="close-button" onClick={handleClick}>
        Sulje
      </button>
      {!isReady && (
        <div className="modal-content">
          <h3>Varaston asetukset</h3>
          <div className="wh-setup">
            <div>
              <label htmlFor="rows">Kuinka monta riviä</label>
              <input
                type="number"
                id="rows"
                value={numberOfRows}
                name="rows"
                onChange={handleNumberOfRowsChange}
              />
            </div>
            <div>
              <label htmlFor="rows">Kuinka monta paikkaa per väli</label>
              <input
                onChange={handleNumberOfSpotsOnGapsChange}
                type="number"
                id="rows"
                value={numberOfSpotsOnGaps}
                name="rows"
              />
            </div>

            {rows.map((row, index) => (
              <div key={index}>
                <label htmlFor={`row-${index}`}>Rivi {index + 1} välit</label>
                <input
                  type="number"
                  id={`row-${index}`}
                  name={`row-${index}`}
                  value={row}
                  onChange={handleRowsChange(index)}
                />
                {/* <button onClick={editRow(index)} className="edit-row-button">
                Muokkaa rivin välejä
              </button> */}
              </div>
            ))}
          </div>
        </div>
      )}
      {!isReady && (
        <button className="save-button" onClick={handleSubmit}>
          Tallenna
        </button>
      )}
      {isReady && (
        <div>
          <h3>Varaston asetukset ovat valmiit</h3>
          <p>Muuttaminen rikkoo varaston</p>
          <button className="enable-button" onClick={handleEnable}>
            Avaa asetukset
          </button>
        </div>
      )}
    </div>
  );
};

export default WarehouseSetupModal;
