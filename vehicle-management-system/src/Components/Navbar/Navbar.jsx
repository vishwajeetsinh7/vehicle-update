import React, { useState } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    // Navigate to home (or login page) on logout
    navigate('/');
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src={car} alt="logo" className="logo" />
        <ul className="nav-links">
          <li><a href="/home">Home</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </div>

      <div className="navbar-right">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <img src={search_icon_light} alt="search" />
        </div>

        <div className="user-info">
          <span className="welcome-text">Welcome, {email}</span>
          
          {/* Profile, Notifications, Settings */}
          <div className="navbar-icons">
            <div className="icon" onClick={toggleDropdown}>
              <span><svg width="30px" height="30px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
  {/*!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.*/}
  <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
</svg>
</span>
              {isDropdownOpen && (
                <div className="dropdown">
                  <a href="/profile">Profile</a>
                  <a href="/settings">Settings</a>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>

            <div className="icon">
              <img src={search_icon_light} alt="notifications" />
              <span className="notification-count">3</span>
            </div>

            <div className="icon">
              <img src={toogle_dark} alt="theme toggle" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
