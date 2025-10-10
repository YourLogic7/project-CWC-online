import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import './Dashboard.css'; // Import the new CSS file

function Dashboard({ toggleSidebar, isDarkMode, toggleDarkMode }) {
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({ total: 0, average: 0, userCounts: {} });
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState('all');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    calculateStats(submissions, selectedUser);
  }, [submissions, selectedUser]);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/submissions`, {
        headers: {
          'x-auth-token': token,
        },
      });
      setSubmissions(res.data);
      
      const uniqueUsers = [...new Set(res.data.map(item => item.user?.nama).filter(Boolean))];
      setUserList(uniqueUsers);

    } catch (err) {
      console.error("Error fetching submissions:", err);
    }
  };

  const calculateStats = (data, filter) => {
    const filteredData = filter === 'all' 
      ? data 
      : data.filter(submission => submission.user?.nama === filter);

    const total = filteredData.length;

    const userCounts = filteredData.reduce((acc, submission) => {
      const userName = submission.user?.nama || 'Unknown User';
      acc[userName] = (acc[userName] || 0) + 1;
      return acc;
    }, {});

    const uniqueUsersInFullData = Object.keys(data.reduce((acc, s) => {
        if (s.user?.nama) acc[s.user.nama] = true; return acc;
    }, {})).length;

    const average = filter === 'all' && uniqueUsersInFullData > 0 
      ? (data.length / uniqueUsersInFullData).toFixed(2) 
      : (filter !== 'all' ? total : 0);

    setStats({ total, average, userCounts });
  };

  const handleFilterChange = (e) => {
    setSelectedUser(e.target.value);
  };

  return (
    <div className="dashboard-container">
      <Header toggleSidebar={toggleSidebar} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="filter-container">
          <label htmlFor="user-filter">Filter by User:</label>
          <select id="user-filter" value={selectedUser} onChange={handleFilterChange}>
            <option value="all">All Users</option>
            {userList.map(user => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h2>{selectedUser === 'all' ? 'Total Submissions' : `Submissions by ${selectedUser}`}</h2>
          <p>{stats.total}</p>
        </div>
        {selectedUser === 'all' ? (
          <div className="stat-card">
            <h2>Average per User</h2>
            <p>{stats.average}</p>
          </div>
        ) : (
          <div className="stat-card">
            <h2>Total Submissions by {selectedUser}</h2>
            <p>{stats.average}</p>
          </div>
        )}
      </div>

      {selectedUser === 'all' && (
        <div className="table-container">
          <h2>Submissions by User</h2>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Number of Submissions</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats.userCounts)
                  .sort(([, a], [, b]) => b - a)
                  .map(([userName, count]) => (
                    <tr key={userName}>
                      <td>{userName}</td>
                      <td>{count}</td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
