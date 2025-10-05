import React, { useState, useEffect } from 'react';
import Header from './Header';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import './Home.css';

function Home({ toggleSidebar, user }) {
  const [formData, setFormData] = useState({
    perner: '',
    headline: '',
    layanan: '',
    dsc: '',
    insera: '',
    pelanggan: '',
    cp: '',
    resume: '',
    alamat: '',
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

  useEffect(() => {
    fetchSubmissions();
  }, []);

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
    // ... (generation logic remains the same)
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
      // Reset form logic...
    } catch (err) {
      console.error(err);
    }
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
      <Header toggleSidebar={toggleSidebar} />
      <h1>Generator Updatan</h1>
      
      <form id="myForm">
        <div className="form-section">
          <h3>Informasi Dasar</h3>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="perner">Perner Anda:</label>
              <input type="text" id="perner" name="perner" placeholder="Isi perner..." value={formData.perner} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label htmlFor="headline">Headline Tiket:</label>
              <input type="text" id="headline" name="headline" placeholder="Isi headline..." value={formData.headline} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label htmlFor="layanan">No Layanan:</label>
              <input type="text" id="layanan" name="layanan" placeholder="Contoh: 11234224543" value={formData.layanan} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Detail Tiket & Pelanggan</h3>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="dsc">Tiket DSC</label>
              <input type="text" id="dsc" name="dsc" placeholder="Contoh: 1-MPX1P09" value={formData.dsc} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label htmlFor="insera">Tiket INSERA</label>
              <input type="text" id="insera" name="insera" placeholder="Contoh: INC52312445" value={formData.insera} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label htmlFor="pelanggan">Nama Pelanggan</label>
              <input type="text" id="pelanggan" name="pelanggan" placeholder="Contoh: Agus Kurnaedi" value={formData.pelanggan} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label htmlFor="cp">No CP Pelanggan</label>
              <input type="text" id="cp" name="cp" placeholder="Contoh: 082xxxxxxxxx" value={formData.cp} onChange={handleChange} />
            </div>
             <div className="form-field">
              <label htmlFor="resume">Resume Case</label>
              <input type="text" id="resume" name="resume" placeholder="Isi resume case..." value={formData.resume} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label htmlFor="alamat">Report Date</label>
              <input type="text" id="alamat" name="alamat" placeholder="Contoh: 2025-10-04 15:00:35" value={formData.alamat} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Informasi Kordinasi & Solver</h3>
           <div className="form-grid">
            <div className="form-field">
              <label htmlFor="pengecekan">Hasil Pengecekan:</label>
              <textarea id="pengecekan" name="pengecekan" placeholder="Cek DSC, permintaan PI, dll." rows="4" value={formData.pengecekan} onChange={handleChange}></textarea>
            </div>
            <div className="form-field">
              <label htmlFor="jabatan">Unit Solver:</label>
              <input type="text" id="jabatan" name="jabatan" placeholder="TIFF HD DISTRICT JAKSEL" value={formData.jabatan} onChange={handleChange} />
            </div>
            <div className="form-field">
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
            <div className="form-field radio-group">
              <h4>Info Update Solver:</h4>
              <div><input type="radio" id="radioBiasa" name="pilihan" value="radioBiasa" checked={radioChoice === 'radioBiasa'} onChange={handleRadioChange} /><label htmlFor="radioBiasa">No Respon</label></div>
              <div><input type="radio" id="radioTextbox" name="pilihan" value="radioTextbox" checked={radioChoice === 'radioTextbox'} onChange={handleRadioChange} /><label htmlFor="radioTextbox">Respon</label></div>
              <div><input type="radio" id="tanpa-kordinasi" name="pilihan" value="tanpa-kordinasi" checked={radioChoice === 'tanpa-kordinasi'} onChange={handleRadioChange} /><label htmlFor="tanpa-kordinasi">Tanpa Kordinasi</label></div>
              <div><input type="checkbox" id="via-grup" name="grup" value="via-grup" checked={viaGrup} onChange={handleCheckboxChange} style={{width: 'auto'}} /><label htmlFor="grup">Via grup</label></div>
            </div>
            {(radioChoice === 'radioTextbox' || radioChoice === 'tanpa-kordinasi') && (
              <div className="form-field">
                <label htmlFor="inputUser">Info Tambahan:</label>
                <textarea id="inputUser" name="inputUser" placeholder="Info solver atau alasan tanpa kordinasi..." rows="3" value={formData.inputUser} onChange={handleChange}></textarea>
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>Hasil Akhir</h3>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="carring">Hasil Carring:</label>
              <input type="text" id="carring" name="carring" placeholder="RNA 3x atau terhubung, acc close" value={formData.carring} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label htmlFor="jam">Jam Carring:</label>
              <input type="text" id="jam" name="jam" placeholder="Isi jam carring..." value={formData.jam} onChange={handleChange} />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="primary" onClick={handleSubmit}>Generate Updatan</button>
            {showResult && <button type="button" onClick={copyToClipboard}>Salin Teks</button>}
          </div>
        </div>
      </form>

      {showResult && (
        <div id="hasil-akhir" dangerouslySetInnerHTML={{ __html: result.dsc + result.insera }}></div>
      )}

      {submittedData.length > 0 && (
        <div className="submitted-data-container">
          <h2>Submitted Data</h2>
          <div style={{ marginBottom: '1rem' }}>
            <button onClick={() => handleExport('csv')} style={{ marginRight: '10px' }}>Download CSV</button>
            <button onClick={() => handleExport('excel')}>Download Excel</button>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Timestamp</th>
                  {Object.keys(formData).map(key => <th key={key}>{key}</th>)}
                </tr>
              </thead>
              <tbody>
                {submittedData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.user.nama}</td>
                    <td>{new Date(data.createdAt).toLocaleString()}</td>
                    {Object.keys(formData).map(key => (
                      <td key={key} className={key === 'headline' ? 'headline-cell' : ''}>
                        {data[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <footer>
        <span>&copy; 2025 develop with Heart dari Rakyat untuk Rakyat. All rights reserved.</span>
      </footer>
    </div>
  );
}

export default Home;
