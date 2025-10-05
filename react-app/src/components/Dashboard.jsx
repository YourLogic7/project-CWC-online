import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({ total: 0, average: 0, userCounts: {} });

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/submissions`, {
        headers: {
          'x-auth-token': token,
        },
      });
      setSubmissions(res.data);
      calculateStats(res.data);
    } catch (err) {
      console.error("Error fetching submissions:", err);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;

    const userCounts = data.reduce((acc, submission) => {
      const userName = submission.user?.nama || 'Unknown User';
      acc[userName] = (acc[userName] || 0) + 1;
      return acc;
    }, {});

    const uniqueUsers = Object.keys(userCounts).length;
    const average = uniqueUsers > 0 ? (total / uniqueUsers).toFixed(2) : 0;

    setStats({ total, average, userCounts });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      {/* Stats Cards */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h2 className="text-xl">Total Submissions</h2>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h2 className="text-xl">Average per User</h2>
          <p className="text-3xl font-bold">{stats.average}</p>
        </div>
      </div>

      {/* User Submissions Table */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Submissions by User</h2>
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>User Name</th>
              <th style={{ textAlign: 'left' }}>Number of Submissions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(stats.userCounts)
              .sort(([, a], [, b]) => b - a) // Sort by submission count descending
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
  );
}

export default Dashboard;
