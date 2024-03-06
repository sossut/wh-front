import React from 'react'
import { InDocket } from '../intefaces/InDocket';

export interface EditInDocketModalProps {
  onClose: () => void;
  stateChange:(
    updateFunction: (prevDockets: InDocket[]) => InDocket[]
  ) => void;
  inDocket: InDocket;
}

const EditInDocketModal: React.FC<EditInDocketModalProps> = ({onClose, inDocket, stateChange}) => {
  return (
    <div className='big-modal'>
      <button className='close-button' onClick={onClose}>
        Sulje
      </button>
      <h2>Muokkaa saapumiserää</h2>
      <form>
        <div>
          <label htmlFor='in-docket-number'>Saapumiserän numero</label>
          <input type='text' id='in-docket-number' value={inDocket.docketNumber}/>
        </div>
        <div>
          <label htmlFor='in-docket-date'>Saapumiserän päivämäärä</label>
          <input type='date' id='in-docket-date' value={1}/>
        </div>
        
        <button type='submit'>Tallenna</button>
      </form>
    </div>
  )
}

export default EditInDocketModal