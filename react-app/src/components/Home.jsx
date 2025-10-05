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
            
            <label htmlFor="alamat"></label>
            <input type="text" id="alamat" name="alamat" placeholder="contoh: 2025-10-04 15:00:35" value={formData.alamat} onChange={handleChange} /><br /><br />
          </div>

          <div id="data">
            <label htmlFor="pelanggan">Nama PIC Kordinasi / CP Solver:</label>
            <input type="text" id="namaSolver" name="namaSolver" placeholder="Contoh: Zainal Arifin" value={formData.namaSolver} onChange={handleChange} />
            <label htmlFor="cp"></label>
            <input type="text" id="cpSolver" name="cpSolver" placeholder="contoh: 082xxxxxxx atau @RizkyC4" value={formData.cpSolver} onChange={handleChange} /><br /><br />
          </div>

        </section>
        <hr />

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
