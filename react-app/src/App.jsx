import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Dashboard from './components/Dashboard.jsx';
import Performance from './components/Performance.jsx';
import { jwtDecode } from 'jwt-decode';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true' ? true : false;
  });
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

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
    setLoading(false);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {isAuthenticated && <Sidebar isOpen={isSidebarOpen} onLogout={handleLogout} toggleSidebar={toggleSidebar} user={user} isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(prevMode => !prevMode)} />}
      <div className="main-content">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={handleRegister} />} />
          <Route
            path="/dashboard"
            element={
              isAuthenticated && user?.role === 'Team Leader' ? (
                <Dashboard toggleSidebar={toggleSidebar} user={user} isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(prevMode => !prevMode)} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/"
            element={
              isAuthenticated ? <Home toggleSidebar={toggleSidebar} user={user} isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(prevMode => !prevMode)} onLogout={handleLogout} /> : <Navigate to="/login" />
            }
          />
                      <Route
                        path="/performance"
                        element={
                          isAuthenticated ? <Performance toggleSidebar={toggleSidebar} user={user} isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(prevMode => !prevMode)} onLogout={handleLogout} /> : <Navigate to="/login" />
                        }
                      />
                      <Route path="*" element={<Navigate to="/" />} />        </Routes>
      </div>
      {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </div>
  );
}

export default App;
