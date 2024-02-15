import React from 'react';

import './App.css';
import NavBar from './components/NavBar';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Warehouse from './pages/Warehouse';
import OutDockets from './pages/OutDockets';
import InDocketsPage from './pages/InDocketsPage';
import Products from './pages/Products';
import Home from './pages/Home';
import ProfilePage from './pages/ProfilePage';
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
          <Route path="/lahteneet" element={<OutDockets />} />
          <Route path="/saapuneet" element={<InDocketsPage />} />
          <Route path="/profiili" element={<ProfilePage />} />
          <Route path="/kirjaudu" element={<LoginPage />} />
        </Routes>
      </AppProvider>
    </Router>
  );
};

export default App;
