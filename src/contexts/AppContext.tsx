import React, { ReactNode, useState, Dispatch, SetStateAction } from 'react';
import PropTypes from 'prop-types';
import { User } from '../intefaces/User';
import { SpotProps } from '../components/Spot';

interface ContextType {
  user: User | null; // Change this to the type of your user state
  setUser: Dispatch<SetStateAction<User | null>>; // Change this to the type of your setUser function
  spots: SpotProps[];
  setSpots?: Dispatch<SetStateAction<SpotProps[]>>;
  updateSpot: (updatedSpot: SpotProps) => void;
}

const AppContext = React.createContext<ContextType>({
  user: null,
  setUser: () => {},
  spots: [],
  setSpots: () => {},
  updateSpot: () => {}
});

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [spots, setSpots] = useState<SpotProps[]>([]);
  const updateSpot = (updatedSpot: SpotProps) => {
    console.log('UPDATED SPOT', updatedSpot);
    setSpots((prevSpots) =>
      prevSpots.map((spot) => (spot.id === updatedSpot.id ? updatedSpot : spot))
    );
  };
  return (
    <AppContext.Provider value={{ user, setUser, spots, updateSpot, setSpots }}>
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node
};

export { AppContext, AppProvider };
