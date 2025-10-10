import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Import the new CSS file

// Simple SVG icons (assuming these are styled by parent or remain inline for color)
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const DashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"></path>
        <path d="M12 6v6l4 2"></path>
    </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const PerformanceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20V10M18 20V4M6 20V16"/>
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

function Sidebar({ isOpen, onLogout, toggleSidebar, user, isDarkMode, toggleDarkMode }) {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <ul className="sidebar-menu">
        <li>
          <Link to="/" onClick={toggleSidebar}>
            <HomeIcon />
            <span>Home</span>
          </Link>
        </li>
        {user && user.role === 'Team Leader' && (
          <li>
            <Link to="/dashboard" onClick={toggleSidebar}>
              <DashboardIcon />
              <span>Dashboard</span>
            </Link>
          </li>
        )}
                {user && user.role.toLowerCase() === 'agent' && (
          <li>
            <Link to="/performance" onClick={toggleSidebar}>
              <PerformanceIcon />
              <span>Performance</span>
            </Link>
          </li>
        )}
        <li>
          <button onClick={onLogout} className="logout-button">
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </li>
        <li className="dark-mode-toggle-container">
          <button onClick={toggleDarkMode} className="dark-mode-switch">
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
