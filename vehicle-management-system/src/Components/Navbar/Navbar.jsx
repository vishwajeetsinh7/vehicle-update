import React from 'react';
import './Navbar.css';
import logo_light from '../../assets/logo-black.png';
import logo_dark from '../../assets/logo-white.png';
import search_icon_light from '../../assets/search-w.png';
import search_icon_dark from '../../assets/search-b.png';
import toogle_dark from '../../assets/day.png';
import toogle_light from '../../assets/night.png';
import car from '../../assets/car.png';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const email = sessionStorage.getItem('email');
  const handleLogout = () => {
    // Navigate to home (or login page) on logout
    navigate('/');
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src={car} alt="logo" className="logo" />
        <ul className="nav-links">
          <li><a href="/home">Home</a></li>
          <li><a href="/services">Services</a></li>
        </ul>
      </div>

      <div className="navbar-right">
        <pre>Welcome, {email}      </pre>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
