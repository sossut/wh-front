import React from 'react';
import { useWarehouse } from '../hooks/ApiHooks';

export interface WarehouseSetupModalProps {
  onClose: () => void;
}

const WarehouseSetupModal: React.FC<WarehouseSetupModalProps> = ({
  onClose
}) => {
  const { postSpots } = useWarehouse();
  const [numberOfRows, setNumberOfRows] = React.useState(0);
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
  React.useEffect(() => {
    console.log('Rows', rows);
    console.log('Number of spots on gaps', numberOfSpotsOnGaps);
  }, [rows, numberOfSpotsOnGaps]);
  return (
    <div className="modal">
      <button className="close-button" onClick={handleClick}>
        Sulje
      </button>
      <div className="modal-content">
        <h3>Varaston asetukset</h3>
        <div className="wh-setup">
          <div>
            <label htmlFor="rows">Kuinka monta riviä</label>
            <input
              type="number"
              id="rows"
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
      <button className="save-button" onClick={handleSubmit}>
        Tallenna
      </button>
    </div>
  );
};

export default WarehouseSetupModal;
