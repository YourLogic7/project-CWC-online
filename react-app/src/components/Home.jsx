import React, { useState, useEffect } from 'react';
import Header from './Header';
import EditModal from './EditModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import './Home.css';

function Home({ toggleSidebar, user, isDarkMode, toggleDarkMode }) {
  const [formData, setFormData] = useState({
    perner: '',
    headline: '',
    layanan: '',
    dsc: '',
    insera: '',
    pelanggan: '',
    cp: '',
    resume: '',
    reportDate: '',
    pengecekan: '',
    jabatan: '',
    carring: '',
    jam: '',
    inputUser: '',
    jabatanSolver: '',
    unitSolver: '',
    kip: '',
    noPermintaan: '',
    statusPermintaan: '',
    detailPermintaan: '',
    namaSolver: '',
    cpSolver: ''
  });

  const [radioChoice, setRadioChoice] = useState('radioBiasa');
  const [viaGrup, setViaGrup] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState({ dsc: '', insera: '' });
  const [submittedData, setSubmittedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState(null);

  const handleRowClick = (submission) => {
    setSelectedSubmission(submission);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSubmission(null);
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
      setSubmittedData(submittedData.filter(item => item._id !== submissionToDelete));
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Error deleting submission:', error);
    }
  };

  const handleUpdateSubmission = (updatedSubmission) => {
    const updatedData = submittedData.map(item => 
      item._id === updatedSubmission._id ? updatedSubmission : item
    );
    setSubmittedData(updatedData);
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search term changes
  };

  // Filter data by today's date
  const todayFilteredSubmissions = submittedData.filter(submission => {
    const submissionDate = new Date(submission.createdAt);
    const today = new Date();
    return (
      submissionDate.getDate() === today.getDate() &&
      submissionDate.getMonth() === today.getMonth() &&
      submissionDate.getFullYear() === today.getFullYear()
    );
  });

  // Further filter by search term
  const filteredSubmissions = todayFilteredSubmissions.filter(submission => {
    const searchLower = searchTerm.toLowerCase();
    return Object.values(submission).some(value =>
      String(value).toLowerCase().includes(searchLower)
    );
  });

  // Derived state for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSubmissions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/submissions`, {
        headers: { 'x-auth-token': token },
      });
      setSubmittedData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleRadioChange = (e) => setRadioChoice(e.target.value);
  const handleCheckboxChange = (e) => setViaGrup(e.target.checked);

  const handleSubmit = (e) => {
    e.preventDefault();

    const { perner, headline, layanan, dsc, insera, pelanggan, cp, resume, reportDate, pengecekan, jabatan, carring, jam, inputUser, kip, noPermintaan, statusPermintaan, detailPermintaan, namaSolver, cpSolver, unitSolver } = formData;

    let hasilPText = '';
    if (radioChoice === 'radioBiasa') {
      hasilPText = "Menunggu info lebih lanjut.";
    } else if (radioChoice === 'tanpa-kordinasi') {
      hasilPText = inputUser;
    } else if (radioChoice === 'radioTextbox') {
      if (inputUser.trim() === '') {
        hasilPText = "ISI INFORMASI TAMBAHANNYAA WOYY!";
      } else {
        hasilPText = inputUser;
      }
    }

    const grupText = viaGrup ? "Via grup," : "";

    let generatedDsc = '';
    let generatedInsera = '';

    if (radioChoice === 'tanpa-kordinasi') {
      // Tanpa Kordinasi format
      generatedDsc = `\n<p>${insera} ${dsc}</p>\n<p>${perner} / C4 Area / Tanpa kordinasi,${hasilPText} / Hasil Cek: ${pengecekan}</p>\n<p>Hasil Carring: ${carring}<br>Jam Carring: ${jam}</p>\n<p>=====================================</p>\n`;

      generatedInsera = `\n<p>${headline}</p>\nNama Pelanggan / CP: ${pelanggan} ${cp}\nNo. Tiket/ No Layanan: ${insera} ${dsc} / ${layanan}\nResume Case: ${resume}\nReport Date: ${reportDate}\n<p></p>\nHasil Pengecekan:\n-Cek: ${pengecekan}\n<p></p>\nHasil Kordinasi:\n- Tanpa kordinasi,  ${hasilPText}\n<p></p>\n Hasil Carring: ${carring}\nJam Carring: ${jam}\n\nDemikian informasinya\nTerima kasih.\n`;
    } else {
      // Kordinasi format
      generatedDsc = `\n<p>${insera} ${dsc}</p>\n${perner} / C4 Area / ${jabatan} / Hasil Cek: ${pengecekan}\nSudah dikordinasikan dengan ${unitSolver} ${jabatan} ${grupText} ${hasilPText}\n<p>=====================================</p>\n`;

      generatedInsera = `\n<p>${headline}</p>\nNama Pelanggan / CP: ${pelanggan} ${cp}\nNo. Tiket/ No Layanan: ${insera} ${dsc} / ${layanan}\nResume Case: ${resume}\nReport Date: ${reportDate}\n<p></p>\nHasil Pengecekan:\n-Cek: ${pengecekan}\nHasil Kordinasi:\nSudah dikordinasikan dengan ${unitSolver} ${jabatan} ${grupText} ${hasilPText}</p>\n<p></p>\nHasil Carring: ${carring}\nJam Carring: ${jam}\n<p></p>\nDemikian informasinya\nTerima kasih.\n`;
    }

    setResult({ dsc: generatedDsc, insera: generatedInsera });
    setShowResult(true);
  };

  const copyToClipboard = async () => {
    // ... (clipboard logic remains the same)
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/api/submissions`, { ...formData, radioChoice, viaGrup }, {
        headers: { 'x-auth-token': token },
      });
      fetchSubmissions();
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData(prevState => ({
      perner: prevState.perner,
      jabatan: prevState.jabatan,
      headline: '',
      layanan: '',
      dsc: '',
      insera: '',
      pelanggan: '',
      cp: '',
      resume: '',
      reportDate: '',
      pengecekan: '',
      carring: '',
      jam: '',
      inputUser: '',
      jabatanSolver: '',
      unitSolver: '',
      kip: '',
      noPermintaan: '',
      statusPermintaan: '',
      detailPermintaan: '',
      namaSolver: '',
      cpSolver: ''
    }));
  };

  const handleExport = (format) => {
    const dataToExport = submittedData.map(data => {
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

  return (
    <div className="home-container">
      <Header toggleSidebar={toggleSidebar} user={user} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <h1 id="judul-di-luhur">Generator Updatan</h1>
      <form id="myForm">

        <section id="perner-headline">
          <div>
            <label htmlFor="perner">Perner loe:</label>
            <input type="text" id="perner" name="perner" placeholder="isi perner loe..." value={formData.perner} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="headline">Headline Tiket:</label>
            <input type="text" id="headline" name="headline" placeholder="Isi headline coy..." value={formData.headline} onChange={handleChange} /><br />
          </div>
          <div>
          <label htmlFor="layanan">No Layanan:</label>
          <input type="text" id="layanan" name="layanan" placeholder="contoh: 11234224543" value={formData.layanan} onChange={handleChange} /><br />
          </div>
        </section>
        
        <hr />
        <br />

        <section id="headline-layanan">
          <div>
            <label htmlFor="dsc">Tiket DSC / Tiket INSERA:</label>
            <input type="text" id="dsc" name="dsc" placeholder="contoh: 1-MPX1P09" value={formData.dsc} onChange={handleChange} />

            <label htmlFor="insera"></label>
            <input type="text" id="insera" name="insera" placeholder="contoh: INC52312445" value={formData.insera} onChange={handleChange} /><br />
          </div>

          <div id="data">
            <label htmlFor="pelanggan">Nama Pelanggan / No CP:</label>
            <input type="text" id="pelanggan" name="pelanggan" placeholder="Contoh: Agus Kurnaedi" value={formData.pelanggan} onChange={handleChange} />
            
            <label htmlFor="cp"></label>
            <input type="text" id="cp" name="cp" placeholder="contoh: 082xxxxxxxxx" value={formData.cp} onChange={handleChange} /><br /><br />
          </div>

          <div id="data">
            <label htmlFor="pelanggan">KIP DSC / No Permintaan:</label>
            <input type="text" id="kip" name="kip" placeholder="Contoh: K31 - Tidak Bisa Browsing - 1P / 3P Mati Total" value={formData.kip} onChange={handleChange} />
            
            <label htmlFor="cp"></label>
            <input type="text" id="noPermintaan" name="noPermintaan" placeholder="contoh: MOk2xxxxxxxxx" value={formData.noPermintaan} onChange={handleChange} /><br /><br />
          </div>

        </section>

        <section id="tiket-data">
          <div id="data">
            <label htmlFor="pelanggan">Status / Detail Status Permintaan:</label>
            <input type="text" id="statusPermintaan" name="statusPermintaan" placeholder="Fallout/Cancel/Completed/dll" value={formData.statusPermintaan} onChange={handleChange} />
            <label htmlFor="cp"></label>
            <input type="text" id="detailPermintaan" name="detailPermintaan" placeholder="contoh: INF005316078|ACTIVATION-9028-OrderLevelError-FAIL:Not Found. Rollback failed" value={formData.detailPermintaan} onChange={handleChange} /><br /><br />
          </div>

          <div>
            <label htmlFor="resume">Resume Case / Report Date:</label>
            <input type="text" id="resume" name="resume" placeholder="Isi resume case nya coy.." value={formData.resume} onChange={handleChange} />
            
            <label htmlFor="reportDate"></label>
            <input type="text" id="reportDate" name="reportDate" placeholder="contoh: 2025-10-04 15:00:35" value={formData.reportDate} onChange={handleChange} /><br /><br />
          </div>

          <div id="data">
            <label htmlFor="pelanggan">Nama PIC Kordinasi / CP Solver:</label>
            <input type="text" id="namaSolver" name="namaSolver" placeholder="Contoh: Zainal Arifin" value={formData.namaSolver} onChange={handleChange} />
            <label htmlFor="cp"></label>
            <input type="text" id="cpSolver" name="cpSolver" placeholder="contoh: 082xxxxxxx atau @RizkyC4" value={formData.cpSolver} onChange={handleChange} /><br /><br />
          </div>

        </section>
        <hr />
        <br />

        <section id="pengecekan-jabatan">
          <div>
            <label htmlFor="pengecekan">Hasil Pengecekan:</label>
            <textarea id="pengecekan" name="pengecekan" placeholder="contoh: cek DSC permintaan PI dll." rows="6" cols="50" value={formData.pengecekan} onChange={handleChange}></textarea><br /><br />
          </div>
          <div>
            <label htmlFor="jabatan">Unit Solver:</label>
            <input type="text" id="jabatan" name="jabatan" placeholder="kalo gak kordinasi gausah di isi yaaa..." value={formData.jabatan} onChange={handleChange} />
            <p style={{ fontSize: '15px', color: 'red' }} id="tulisan">*contoh: TIFF HD DISTRICT JAKSEL, TIFF AOMQ DISTRICT BANDUNG, DLL.<br />(Kosongkan jika tidak kordinasi)</p>
          </div>
          
          <div>
            <label htmlFor="unitSolver">Jabatan Solver:</label>
            <select id="unitSolver" name="unitSolver" value={formData.unitSolver} onChange={handleChange}>
              <option value="">Pilih Jabatan</option>
              <option value="TEAM LEADER">TEAM LEADER</option>
              <option value="SITE MANAGER">SITE MANAGER</option>
              <option value="MANAGER">MANAGER</option>
              <option value="GENERAL MANAGER">GENERAL MANAGER</option>
              <option value="ASMAN">ASMAN</option>
              <option value="SPV">SPV</option>
            </select>
          </div>
        </section>
          
        <section>
          <input type="checkbox" id="via-grup" name="grup" value="via-grup" checked={viaGrup} onChange={handleCheckboxChange} />
          <label id="tulisanGrup" htmlFor="grup">Via grup <span style={{ fontSize: '15px', color: 'red' }}>(Di pilih kalo kordinasi via Grup)</span></label><br />
          <hr />
          <br />
          {/* Pilihan Radio Button */}


          <div>
            <h4>Info Update Solver:</h4>
            <input type="radio" id="radioBiasa" name="pilihan" value="radioBiasa" checked={radioChoice === 'radioBiasa'} onChange={handleRadioChange} />
            <label htmlFor="radioBiasa">No Respon</label>
          </div>

          <div>
            <input type="radio" id="radioTextbox" name="pilihan" value="radioTextbox" checked={radioChoice === 'radioTextbox'} onChange={handleRadioChange} />
            <label htmlFor="radioTextbox">Respon</label>
          </div>

          <div>
            <input type="radio" id="tanpa-kordinasi" name="pilihan" value="tanpa-kordinasi" checked={radioChoice === 'tanpa-kordinasi'} onChange={handleRadioChange} />
            <label htmlFor="tanpa-kordinasi">Tanpa Kordinasi</label>
          </div>
          <br />

          {/* Kotak Teks Tambahan */}
          {(radioChoice === 'radioTextbox' || radioChoice === 'tanpa-kordinasi') && (
            <div id="textboxContainer">
              <label htmlFor="inputUser">Info Tambahan:</label>
              <textarea id="inputUser" name="inputUser" placeholder="isi dengan info tambahan misal: info solver atau info tanpa kordinasinya kenapa" rows="4" cols="50" value={formData.inputUser} onChange={handleChange}></textarea>
            </div>
          )}
        </section>
        <hr />
        <br />
        <section id="carring-jam">
          <div>
            <label htmlFor="carring">Hasil Carring:</label>
            <input type="text" id="carring" name="carring" placeholder="contoh: RNA 3x atau terhubung dengan pelanggan, acc close" value={formData.carring} onChange={handleChange} /><br /><br />
          </div>
          <div>
            <label htmlFor="jam">Jam Carring:</label>
            <input type="text" id="jam" name="jam" placeholder="isi jam Carring nya yaa kakak.." value={formData.jam} onChange={handleChange} /><br /><br />
          </div>
        </section>

        {/* tombol hasil braddder */}
        <label htmlFor="pesan">Sok Pencet Daks:</label>
        <button type="button" id="generator-updatan" onClick={handleSubmit}>Sulap</button>

        {/* untuk copy text */}
        {showResult && <button id="copyAll" onClick={(e) => { e.preventDefault(); copyToClipboard(); }}>Salin Teks :)</button>}
      </form>

      {showResult && (
        <div id="hasil-akhir" dangerouslySetInnerHTML={{ __html: result.dsc + result.insera }}>
        </div>
      )}

      {user && user.role.toLowerCase() === 'agent' && (
        <section className="page-performance-section">
          {submittedData.length > 0 && (
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
                    <option value={submittedData.length}>All</option>
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
                      <th>Headline</th>
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
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((data, index) => (
                      <tr key={index}>
                        <td>{data.user.nama}</td>
                        <td>{new Date(data.createdAt).toLocaleString()}</td>
                        <td>{data.perner}</td>
                        <td>{data.headline}</td>
                        <td>{data.layanan}</td>
                        <td onClick={() => handleRowClick(data)} style={{cursor: 'pointer'}}>{data.dsc}</td>
                        <td onClick={() => handleRowClick(data)} style={{cursor: 'pointer'}}>{data.insera}</td>
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
                        <td><button onClick={() => handleDeleteClick(data._id)}>X</button></td>
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
        </section>
      )}

      {showModal && (
        <EditModal 
          show={showModal} 
          onHide={handleCloseModal} 
          data={selectedSubmission}
          onUpdate={handleUpdateSubmission} 
        />
      )}

      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />

      <footer>
        <span>&copy; 2025 develop with Heart dari Rakyat untuk Rakyat. All rights reserved.</span>
      </footer>
    </div>
  );
}

export default Home;
