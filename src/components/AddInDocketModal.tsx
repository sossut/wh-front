import React from 'react'
import { InDocket } from '../intefaces/InDocket';

export interface AddInDocketModalProps {
  onClose: () => void;
  stateChange:(
    updateFunction: (prevDockets: InDocket[]) => InDocket[]
  ) => void;
}

const AddInDocketModal: React.FC<AddInDocketModalProps> = ({onClose, stateChange}) => {
  return (
    <div className='big-modal'>
      <button className='close-button' onClick={onClose}>
        Sulje
      </button>
      <h2>Lisää saapumiserä</h2>
      <form>
        <div>
          <label htmlFor='in-docket-number'>Saapumiserän numero</label>
          <input type='text' id='in-docket-number' />
        </div>
        <div>
          <label htmlFor='in-docket-date'>Saapumiserän päivämäärä</label>
          <input type='date' id='in-docket-date' />
        </div>
        <div>
          <label htmlFor='in-docket-description'>Saapumiserän kuvaus</label>
          <input type='text' id='in-docket-description' />
        </div>
        <button type='submit'>Lisää</button>
      </form>
    </div>
  )
}

export default AddInDocketModal