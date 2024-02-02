import { useState } from 'react';

export interface FormState {
  namme?: string;
  email?: string;
  password: string;
  username: string;
}

const useForm = (callback: () => void, initState: FormState) => {
  const [inputs, setInputs] = useState(initState);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }
    callback();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist && event.persist();

    setInputs((inputs: FormState) => {
      return {
        ...inputs,
        [event.target.name]: event.target.files
          ? event.target.files[0]
          : event.target.value
      };
    });
  };

  return {
    handleSubmit,
    handleInputChange,
    inputs
  };
};

export default useForm;
