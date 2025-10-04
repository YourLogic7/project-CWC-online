import React, { useState } from 'react';
import Header from './Header'; // Import the Header component

function Home({ toggleSidebar }) { // Receive toggleSidebar as a prop
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
    inputUser: ''
  });

  const [radioChoice, setRadioChoice] = useState('radioBiasa');
  const [viaGrup, setViaGrup] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState({ dsc: '', insera: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleRadioChange = (e) => {
    setRadioChoice(e.target.value);
  };

  const handleCheckboxChange = (e) => {
    setViaGrup(e.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasilPText = '';
    if (radioChoice === 'radioBiasa') {
      hasilPText = "Menunggu info lebih lanjut.";
    } else if (radioChoice === 'tanpa-kordinasi') {
      hasilPText = formData.inputUser;
    } else if (radioChoice === 'radioTextbox') {
      if (formData.inputUser.trim() === '') {
        hasilPText = "ISI INFORMASI TAMBAHANNYAA WOYY!";
      } else {
        hasilPText = formData.inputUser;
      }
    }

    const grupText = viaGrup ? "Via grup," : "";

    const hasilDsc = `
      <p>${formData.insera} ${formData.dsc}</p>
      ${formData.perner} / C4 Area / ${formData.jabatan} / Hasil Cek: ${formData.pengecekan}<br>
      Sudah dikordinasikan dengan ${formData.jabatan} ${grupText} ${hasilPText}
      <p>=====================================</p>
    `;

    const hasilInsera = `
      <p>${formData.headline}</p>
      Nama Pelanggan / CP: ${formData.pelanggan} ${formData.cp}<br>
      No. Tiket/ No Layanan: ${formData.insera} ${formData.dsc} / ${formData.layanan}<br>
      Resume Case: ${formData.resume}<br>
      Report Date: ${formData.alamat}<br>
      <p></p>
      Hasil Pengecekan:<br>
      -Cek: ${formData.pengecekan}<br>
      Hasil Kordinasi:<br>
      Sudah dikordinasikan dengan ${formData.jabatan} ${grupText} ${hasilPText}</p>
      <p></p>
      Hasil Carring: ${formData.carring}<br>
      Jam Carring: ${formData.jam}<br>
      <p></p>
      Demikian informasinya<br>
      Terima kasih.
    `;

    const hasiltankorDsc = `
      <p>${formData.insera} ${formData.dsc}</p>
      <p>${formData.perner} / C4 Area / Tanpa kordinasi,${hasilPText} / Hasil Cek: ${formData.pengecekan}</p>
      <p>${formData.carring}<br>${formData.jam}</p>
      <p>=====================================</p>
    `;

    const hasiltankorInsera = `
      <p>${formData.headline}</p>
      Nama Pelanggan / CP: ${formData.pelanggan} ${formData.cp}<br>
      No. Tiket/ No Layanan: ${formData.insera} ${formData.dsc} / ${formData.layanan}<br>
      Resume Case: ${formData.resume}<br>
      Report Date: ${formData.alamat}<br>
      <p></p>
      Hasil Pengecekan:<br>
      -Cek: ${formData.pengecekan}<br>
      <p></p>
      Hasil Kordinasi:<br>
      - Tanpa kordinasi,  ${hasilPText}<br>
      <p></p>
      Hasil Carring: ${formData.carring}<br>
      Jam Carring: ${formData.jam}<br>
      <p> </p>
      Demikian informasinya<br>
      Terima kasih.
    `;

    if (radioChoice === 'tanpa-kordinasi') {
      setResult({ dsc: hasiltankorDsc, insera: hasiltankorInsera });
    } else {
      setResult({ dsc: hasilDsc, insera: hasilInsera });
    }

    setShowResult(true);
    setFormData(prevState => ({
      ...prevState,
      perner: prevState.perner, // Keep the perner value
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
      inputUser: ''
    }));
  };

  const copyToClipboard = () => {
    const textToCopy = document.getElementById('hasil-akhir').innerText;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        alert('Teks berhasil disalin ke clipboard!');
      })
      .catch(err => {
        alert('Gagal menyalin teks.');
      });
  };

  return (
    <div>
      <Header toggleSidebar={toggleSidebar} />
      <h1 id="judul-di-luhur">Generator Updatan</h1>
      <form id="myForm">
        <label htmlFor="perner">Perner loe:</label>
        <input type="text" id="perner" name="perner" placeholder="isi perner loe..." value={formData.perner} onChange={handleChange} /><hr /><br />

        <section id="headline-layanan">
          <div>
            <label htmlFor="headline">Headline Tiket:</label>
            <input type="text" id="headline" name="headline" placeholder="Isi headline coy..." value={formData.headline} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="layanan">No Layanan:</label>
            <input type="text" id="layanan" name="layanan" placeholder="contoh: 11234224543" value={formData.layanan} onChange={handleChange} /><br />
          </div>
        </section>

        <section id="tiket-data">
          <div id="tiket">
            <label htmlFor="dsc">Tiket DSC / Tiket INSERA:</label>
            <input type="text" id="dsc" name="dsc" placeholder="contoh: 1-MPX1P09" value={formData.dsc} onChange={handleChange} />

            <label htmlFor="insera"></label>
            <input type="text" id="insera" name="insera" placeholder="contoh: INC52312445" value={formData.insera} onChange={handleChange} /><br /><br />
          </div>

          <div id="data">
            <label htmlFor="pelanggan">Nama Pelanggan / No CP:</label>
            <input type="text" id="pelanggan" name="pelanggan" placeholder="Contoh: Rijal Indra Kurnaedi" value={formData.pelanggan} onChange={handleChange} />
            <label htmlFor="cp"></label>
            <input type="text" id="cp" name="cp" placeholder="contoh: 082xxxxxxxxx" value={formData.cp} onChange={handleChange} /><br /><br />
          </div>
        </section>
        <hr />
        <section id="resume-report">
          <div>
            <label htmlFor="resume">Resume Case:</label>
            <input type="text" id="resume" name="resume" placeholder="Isi resume case nya coy.." value={formData.resume} onChange={handleChange} /><br /><br />
          </div>
          <div>
            <label htmlFor="alamat">Report Date:</label>
            <input type="text" id="alamat" name="alamat" placeholder="contoh: Jl. in aja dlu jaksel" value={formData.alamat} onChange={handleChange} /><br /><br />
          </div>
        </section>
        <section id="pengecekan-jabatan">
          <div>
            <label htmlFor="pengecekan">Hasil Pengecekan:</label>
            <textarea id="pengecekan" name="pengecekan" placeholder="contoh: cek DSC permintaan PI dll." rows="6" cols="50" value={formData.pengecekan} onChange={handleChange}></textarea><br /><br />
          </div>
          <div>
            <label htmlFor="jabatan">Jabatan Solver:</label>
            <input type="text" id="jabatan" name="jabatan" placeholder="kalo gak kordinasi gausah di isi yaaa..." value={formData.jabatan} onChange={handleChange} />
            <p style={{ fontSize: '15px', color: 'red' }} id="tulisan">*contoh: TIFF HD DISTRICT JAKSEL, HSA JAKSEL, Korlap JAKSEL, dst. <br />(Kosongkan jika tidak kordinasi)</p>
          </div>
        </section>
        <section>
          <input type="checkbox" id="via-grup" name="grup" value="via-grup" checked={viaGrup} onChange={handleCheckboxChange} />
          <label htmlFor="grup">Via grup:</label><br />
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

      <footer>
        <span>&copy; 2025 develop with Heart dari Rakyat untuk Rakyat. All rights reserved.</span>
      </footer>
    </div>
  );
}

export default Home;
