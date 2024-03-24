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
            value={inDocket.docketNumber}
          />
        </div>
        <div>
          <label htmlFor="in-docket-date">Saapumiserän päivämäärä</label>
          <input type="date" id="in-docket-date" value={1} />
        </div>

        <button type="submit">Tallenna</button>
      </form>
      <button>Poista Lähete</button>
    </div>
  );
};

export default EditInDocketModal;
