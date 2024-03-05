import React from 'react';

import './App.css';
import NavBar from './components/NavBar';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Warehouse from './pages/Warehouse';
import OutDockets from './pages/OutDockets';
import InDockets from './pages/InDockets';
import Products from './pages/Products';
import Home from './pages/Home';
import Profile from './pages/Profile';
import LoginPage from './pages/LoginPage';
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
          <Route path="/lahetteet" element={<OutDockets />} />
          <Route path="/saapuneet" element={<InDockets />} />
          <Route path="/profiili" element={<Profile />} />
          <Route path="/kirjaudu" element={<LoginPage />} />
        </Routes>
      </AppProvider>
    </Router>
  );
};

export default App;
