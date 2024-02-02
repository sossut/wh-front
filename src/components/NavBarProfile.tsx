import { NavLink } from 'react-router-dom';

const NavBarProfile = () => {
  return (
    <div className="navbar-profile">
      <NavLink to="/profiili">Profiili</NavLink>
      <NavLink to="/kirjaudu">Kirjaudu sisään</NavLink>
    </div>
  );
};

export default NavBarProfile;
