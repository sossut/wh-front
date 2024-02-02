import React from 'react';

import './App.css';
import NavBar from './components/NavBar';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Warehouse from './components/Warehouse';
import Dockets from './pages/Dockets';
import Products from './pages/Products';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import { AppProvider } from './contexts/AppContext';

const App: React.FC = () => {
  return (
    <Router>
      <AppProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/varasto" element={<Warehouse />} />
          <Route path="/tuotteet" element={<Products />} />
          <Route path="/lahetteet" element={<Dockets />} />
          <Route path="/profiili" element={<Profile />} />
          <Route path="/kirjaudu" element={<Login />} />
        </Routes>
      </AppProvider>
    </Router>
  );
};

export default App;
