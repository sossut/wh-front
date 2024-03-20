import React from 'react';
import { NavLink } from 'react-router-dom';
import NavBarProfile from './NavBarProfile';
import logo from '../assets/logo_small.svg';

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-core">
        <NavLink id="logo" to={'/'} className="navbar-logo">
          <img src={logo}></img>
        </NavLink>
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
        <NavLink to={'/saapuneet'} className="navbar-link">
          Saapuneet
        </NavLink>
        <NavLink to={'/tunnit'} className="navbar-link">
          Tunnit
        </NavLink>
      </div>
      <NavBarProfile />
    </nav>
  );
};

export default NavBar;
