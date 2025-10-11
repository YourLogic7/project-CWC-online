import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import './Dashboard.css';

function Dashboard({ toggleSidebar, user, isDarkMode, toggleDarkMode }) {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [stats, setStats] = useState({ total: 0, average: 0, userCounts: {} });
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    let filtered = submissions;

    if (selectedUser !== 'all') {
      filtered = filtered.filter(submission => submission.user?.nama === selectedUser);
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the entire end day
      filtered = filtered.filter(submission => {
        const submissionDate = new Date(submission.createdAt);
        return submissionDate >= start && submissionDate <= end;
      });
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(submission =>
        Object.values(submission).some(value =>
          String(value).toLowerCase().includes(searchLower)
        )
      );
    }

    setFilteredSubmissions(filtered);
    calculateStats(filtered, selectedUser);
    setCurrentPage(1);
  }, [submissions, selectedUser, startDate, endDate, searchTerm]);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/submissions`, {
        headers: { 'x-auth-token': token },
      });
      setSubmissions(res.data);
      const uniqueUsers = [...new Set(res.data.map(item => item.user?.nama).filter(Boolean))];
      setUserList(uniqueUsers);
    } catch (err) {
      console.error("Error fetching submissions:", err);
    }
  };

  const calculateStats = (data, filter) => {
    const total = data.length;
    const userCounts = data.reduce((acc, submission) => {
      const userName = submission.user?.nama || 'Unknown User';
      acc[userName] = (acc[userName] || 0) + 1;
      return acc;
    }, {});

    const uniqueUsersInFullData = Object.keys(submissions.reduce((acc, s) => {
        if (s.user?.nama) acc[s.user.nama] = true; return acc;
    }, {})).length;

    const average = filter === 'all' && uniqueUsersInFullData > 0 
      ? (submissions.length / uniqueUsersInFullData).toFixed(2) 
      : (filter !== 'all' ? total : 0);

    setStats({ total, average, userCounts });
  };

  const handleFilterChange = (e) => setSelectedUser(e.target.value);
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleExport = (format) => {
    const dataToExport = filteredSubmissions.map(data => {
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

  const handleDeleteClick = (submissionId) => {
    setSubmissionToDelete(submissionId);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSubmissionToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/submissions/${submissionToDelete}`, {
        headers: { 'x-auth-token': token },
      });
      setSubmissions(submissions.filter(item => item._id !== submissionToDelete)); // Update submissions state
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Error deleting submission:', error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSubmissions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="dashboard-container">
      <Header toggleSidebar={toggleSidebar} user={user} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
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
          <label htmlFor="start-date">Start Date:</label>
          <input type="date" id="start-date" value={startDate} onChange={handleStartDateChange} />
          <label htmlFor="end-date">End Date:</label>
          <input type="date" id="end-date" value={endDate} onChange={handleEndDateChange} />
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

      <div className="table-container">
        <h2>All Submissions</h2>
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
              <option value={filteredSubmissions.length}>All</option>
            </select>
          </div>
        </div>
        <div className="table-wrapper">
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ padding: '0.5rem', width: '100%', maxWidth: '300px' }}
            />
          </div>
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
                <th>Actions</th> {/* Added Actions column */}
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
                  <td><button onClick={() => handleDeleteClick(data._id)} style={{ color: '#fa3232', fontSize: '1.2rem' }}>Delete data</button></td> {/* Added Delete button */}
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
      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default Dashboard;
