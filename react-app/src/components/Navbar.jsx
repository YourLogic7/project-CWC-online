import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ isAuthenticated, onLogout }) {
  return (
    <nav>
      <ul>
        {isAuthenticated ? (
          <>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <button onClick={onLogout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
