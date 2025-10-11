
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import Header from './Header';
import './Performance.css';

function Performance({ toggleSidebar, user, isDarkMode, toggleDarkMode }) {
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({ total: 0, average: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search term changes
  };

  const filteredSubmissions = submissions.filter(submission => {
    const searchLower = searchTerm.toLowerCase();
    return Object.values(submission).some(value =>
      String(value).toLowerCase().includes(searchLower)
    );
  });

  const handleExport = (format) => {
    const dataToExport = submissions.map(data => {
      const { user, createdAt, ...rest } = data;
      return {
        nama_pengguna: user.nama,
        timestamp: new Date(createdAt).toLocaleString(),
        ...rest
      };
    });
    if (format === 'csv') {
      const csv = Papa.unparse(dataToExport);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'submissions.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'excel') {
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Submissions");
      XLSX.writeFile(workbook, "submissions.xlsx");
    }
  };

  // Derived state for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSubmissions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="performance-container">
      <Header toggleSidebar={toggleSidebar} user={user} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
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

      {submissions.length > 0 && (
        <div className="submitted-data-container">
          <h2>All Submitted Data</h2>
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <button onClick={() => handleExport('csv')} style={{ marginRight: '10px' }}>Download CSV</button>
              <button onClick={() => handleExport('excel')}>Download Excel</button>
            </div>
            <div>
              <label htmlFor="items-per-page">Items per page:</label>
              <select id="items-per-page" value={itemsPerPage} onChange={handleItemsPerPageChange}>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="40">40</option>
                <option value="60">60</option>
                <option value="80">80</option>
                <option value="100">100</option>
                <option value={submissions.length}>All</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ padding: '0.5rem', width: '100%', maxWidth: '300px' }}
            />
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Timestamp</th>
                  <th>Perner</th>
                  <th>Layanan</th>
                  <th>DSC</th>
                  <th>INSERA</th>
                  <th>Pelanggan</th>
                  <th>CP</th>
                  <th>Resume</th>
                  <th>Report Date</th>
                  <th>Pengecekan</th>
                  <th>Jabatan</th>
                  <th>Carring</th>
                  <th>Jam</th>
                  <th>Input User</th>
                  <th>Jabatan Solver</th>
                  <th>Unit Solver</th>
                  <th>KIP</th>
                  <th>No Permintaan</th>
                  <th>Status Permintaan</th>
                  <th>Detail Permintaan</th>
                  <th>Nama Solver</th>
                  <th>CP Solver</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((data, index) => (
                  <tr key={index}>
                    <td>{data.user.nama}</td>
                    <td>{new Date(data.createdAt).toLocaleString()}</td>
                    <td>{data.perner}</td>
                    <td>{data.layanan}</td>
                    <td>{data.dsc}</td>
                    <td>{data.insera}</td>
                    <td>{data.pelanggan}</td>
                    <td>{data.cp}</td>
                    <td>{data.resume}</td>
                    <td>{data.reportDate}</td>
                    <td>{data.pengecekan}</td>
                    <td>{data.jabatan}</td>
                    <td>{data.carring}</td>
                    <td>{data.jam}</td>
                    <td>{data.inputUser}</td>
                    <td>{data.jabatanSolver}</td>
                    <td>{data.unitSolver}</td>
                    <td>{data.kip}</td>
                    <td>{data.noPermintaan}</td>
                    <td>{data.statusPermintaan}</td>
                    <td>{data.detailPermintaan}</td>
                    <td>{data.namaSolver}</td>
                    <td>{data.cpSolver}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Previous</button>
            {pageNumbers.map(number => (
              <button key={number} onClick={() => setCurrentPage(number)} className={currentPage === number ? 'active' : ''}>
                {number}
              </button>
            ))}
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Performance;
