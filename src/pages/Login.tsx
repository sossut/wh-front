import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import LoginForm from '../components/LoginForm';
const Login = () => {
  const [toggle, setToggle] = useState(true);
  return (
    <>
      <LoginForm toggle={toggle} />
    </>
  );
};

export default Login;
