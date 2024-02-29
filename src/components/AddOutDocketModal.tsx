import React from 'react'
import { OutDocket } from '../intefaces/OutDocket';

export interface AddOutDocketModalProps {
    onClose: () => void;
    stateChanger: (updateFunction: (prevDockets: OutDocket[]) => OutDocket[]) => void;
}

const AddOutDocketModal: React.FC<AddOutDocketModalProps> = ({onClose, stateChanger}) => {
  return (
    <div className='big-modal'>
        <div className='close-button' onClick={onClose}>Sulje</div>
    </div>
  )
}

export default AddOutDocketModal