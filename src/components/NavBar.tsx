import React from 'react';
import { NavLink } from 'react-router-dom';
import NavBarProfile from './NavBarProfile';

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-core">
        <NavLink to={'/'} className="navbar-logo"></NavLink>
        <NavLink to={'/'} className="navbar-link">
          Etusivu
        </NavLink>
        <NavLink to={'/varasto'} className="navbar-link">
          Varasto
        </NavLink>
        <NavLink to={'/tuotteet'} className="navbar-link">
          Tuotteet
        </NavLink>
        <NavLink to={'/lahetteet'} className="navbar-link">
          Lähetteet
        </NavLink>
      </div>
      <NavBarProfile />
    </nav>
  );
};

export default NavBar;
