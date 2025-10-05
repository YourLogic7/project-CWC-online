import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Dashboard from './components/Dashboard.jsx';
import { jwtDecode } from 'jwt-decode';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken.user);
        setIsAuthenticated(true);
      } catch (error) {
        // Handle invalid token
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLogin = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser(decodedToken.user);
      setIsAuthenticated(true);
      navigate('/');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setSidebarOpen(false); // Close sidebar on logout
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Determine if Sidebar should be shown
  const showSidebar = isAuthenticated && (location.pathname === '/' || location.pathname === '/dashboard');

  return (
    <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {isAuthenticated && <Sidebar isOpen={isSidebarOpen} onLogout={handleLogout} toggleSidebar={toggleSidebar} user={user} />}
      <div className="main-content">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={handleRegister} />} />
          <Route
            path="/dashboard"
            element={
              isAuthenticated && user?.role === 'Team Leader' ? (
                <Dashboard />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/"
            element={
              isAuthenticated ? <Home toggleSidebar={toggleSidebar} user={user} /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
      {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </div>
  );
}

export default App;
