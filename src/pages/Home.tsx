import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

const Home = () => {
  const { user } = useContext(AppContext);
  console.log(user);
  return <div>Home</div>;
};

export default Home;
