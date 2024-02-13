import React, { useState } from 'react';

import LoginForm from '../components/LoginForm';
const LoginPage = () => {
  const [toggle, setToggle] = useState(true);
  return (
    <>
      <LoginForm toggle={toggle} />
    </>
  );
};

export default LoginPage;
