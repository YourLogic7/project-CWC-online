
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Performance.css';

function Performance() {
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({ total: 0, average: 0 });

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    if (submissions.length > 0) {
      calculateStats(submissions);
    }
  }, [submissions]);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/submissions`, {
        headers: {
          'x-auth-token': token,
        },
      });
      setSubmissions(res.data);
    } catch (err) {
      console.error("Error fetching submissions:", err);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    const uniqueDays = new Set(data.map(submission => new Date(submission.createdAt).toDateString()));
    const average = uniqueDays.size > 0 ? (total / uniqueDays.size).toFixed(2) : 0;
    setStats({ total, average });
  };

  return (
    <div className="performance-container">
      <div className="performance-header">
        <h1>Performance</h1>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h2>Total Submissions</h2>
          <p>{stats.total}</p>
        </div>
        <div className="stat-card">
          <h2>Average Submissions per Day</h2>
          <p>{stats.average}</p>
        </div>
      </div>

      <div className="table-container">
        <h2>All Submissions</h2>
        <table className="performance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Headline</th>
              <th>Layanan</th>
              <th>DSC</th>
              <th>INSERA</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission._id}>
                <td>{new Date(submission.createdAt).toLocaleString()}</td>
                <td>{submission.headline}</td>
                <td>{submission.layanan}</td>
                <td>{submission.dsc}</td>
                <td>{submission.insera}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Performance;
