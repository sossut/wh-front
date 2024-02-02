import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useLogin } from '../hooks/ApiHooks';
import useForm from '../hooks/FormHooks';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  toggle: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ toggle }) => {
  const { user, setUser } = useContext(AppContext);

  const start = {
    username: '',
    password: ''
  };
  const { postLogin } = useLogin();
  const navigate = useNavigate();
  const doLogin = async () => {
    try {
      const userdata = await postLogin(inputs);
      console.log('userdata', userdata);
      if (userdata.user) {
        localStorage.setItem('token', userdata.token);
        setUser(userdata.user);
      }
      navigate('/');
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
      } else {
        throw e;
      }
    }
  };
  const { inputs, handleInputChange, handleSubmit } = useForm(doLogin, start);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="email"
          onChange={handleInputChange}
          value={inputs.username}
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          onChange={handleInputChange}
          value={inputs.password}
        />
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default LoginForm;
