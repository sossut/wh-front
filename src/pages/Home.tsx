import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import DaysShipmentsComp from '../components/DaysShipmentsComp';

const Home = () => {
  const { user } = useContext(AppContext);
  console.log(user);
  return (
    <div>
      <DaysShipmentsComp />
    </div>
  );
};

export default Home;
