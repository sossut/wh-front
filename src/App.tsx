import React from 'react';

import './App.css';
import NavBar from './components/NavBar';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import WarehousePage from './pages/WarehousePage';
import OutDocketsPage from './pages/OutDocketsPage';
import InDocketsPage from './pages/InDocketsPage';
import ProductsPage from './pages/ProductsPage';
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
          <Route path="/varasto" element={<WarehousePage />} />
          <Route path="/tuotteet" element={<ProductsPage />} />
          <Route path="/lahteneet" element={<OutDocketsPage />} />
          <Route path="/saapuneet" element={<InDocketsPage />} />
          <Route path="/profiili" element={<ProfilePage />} />
          <Route path="/kirjaudu" element={<LoginPage />} />
        </Routes>
      </AppProvider>
    </Router>
  );
};

export default App;
