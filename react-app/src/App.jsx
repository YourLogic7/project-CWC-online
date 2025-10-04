import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate('/');
  };

  const handleLogout = () => {
    setSidebarOpen(false); // Close sidebar on logout
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Determine if Sidebar should be shown
  const showSidebar = location.pathname === '/';

  return (
    <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {showSidebar && <Sidebar isOpen={isSidebarOpen} onLogout={handleLogout} toggleSidebar={toggleSidebar} />}
      <div className="main-content">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={handleRegister} />} />
          <Route
            path="/"
            element={
              isAuthenticated ? <Home toggleSidebar={toggleSidebar} /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
      {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </div>
  );
}

export default App;
