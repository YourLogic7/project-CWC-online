let dataTersimpan = [];

// untuk menampilkan texbox sesuai pilihan radio button
document.addEventListener('DOMContentLoaded', function() {
    //event listener untuk mendeteksi perubahan radio button
    const tanpaKordinasi = document.getElementById('tanpa-kordinasi')
    const radioBiasa = document.getElementById('radioBiasa');
    const radioTextbox = document.getElementById('radioTextbox');
    const textboxContainer = document.getElementById('textboxContainer');
    
    radioBiasa.addEventListener('change', function() {
        if (this.checked) {
            textboxContainer.style.display = 'none';
        }
    });
    
    tanpaKordinasi.addEventListener('change', function() {
        if (this.checked) {
            textboxContainer.style.display = 'block';
        }
    });

    radioTextbox.addEventListener('change', function() {
        if (this.checked) {
            textboxContainer.style.display = 'block';
        }
    });
});

// membuat fungsi untuk menyimpan data
const generatorButton = document.getElementById('generator-updatan');
const copyAll = document.getElementById('copyAll');

function copyTextToClipboard() {
  // Only copy the output of the element that is currently displayed (display: block)
  const hasilAkhirKordinasi = document.getElementById('hasil-akhir-kordinasi');
  const hasilAkhirTanpaKordinasi = document.getElementById('hasil-akhir-tanpa-kordinasi');
  let textToCopy = '';

  if (hasilAkhirKordinasi.style.display === 'block') {
    textToCopy = hasilAkhirKordinasi.innerText;
  } else if (hasilAkhirTanpaKordinasi.style.display === 'block') {
    textToCopy = hasilAkhirTanpaKordinasi.innerText;
  }

  navigator.clipboard.writeText(textToCopy)
    .then(() => {
      alert('Teks berhasil disalin ke clipboard!');
    })
    .catch(err => {
      alert('Gagal menyalin teks.');
    });
};

copyAll.addEventListener('click', copyTextToClipboard);

// fungsi untuk menampilkan tombol salin setelah tombol generator diklik
generatorButton.addEventListener('click', function() {
  copyAll.style.display = 'block';
});

// opsi: sembunyikan tombol salin saat halaman di click
copyAll.addEventListener('click', function() {
  copyAll.style.display = 'none';
});



// fungsi untuk menampilkan data
function tampilkanData() {
  const perner = document.getElementById('perner').value;
  const dsc = document.getElementById('dsc').value;
  const insera = document.getElementById('insera').value;
  const headline = document.getElementById('headline').value;
  const pelanggan = document.getElementById('pelanggan').value;
  const cp = document.getElementById('cp').value;
  const layanan = document.getElementById('layanan').value;
  const resume = document.getElementById('resume').value;
  const alamat = document.getElementById('alamat').value;
  const pengecekan = document.getElementById('pengecekan').value;
  const jabatan = document.getElementById('jabatan').value;
  const carring = document.getElementById('carring').value;
  const jam = document.getElementById('jam').value;
  const inputUser = document.getElementById('inputUser');
  const radioBiasa = document.getElementById('radioBiasa');
  const radioTextbox = document.getElementById('radioTextbox');
  const tanpaKordinasi = document.getElementById('tanpa-kordinasi')
  const hasilAkhirKordinasi = document.getElementById('hasil-akhir-kordinasi');
  const hasilAkhirTanpaKordinasi = document.getElementById('hasil-akhir-tanpa-kordinasi');


  // buat reset form
  document.getElementById("dsc").value = "";
  document.getElementById('insera').value = "";
  document.getElementById('headline').value = "";
  document.getElementById('pelanggan').value = "";
  document.getElementById('cp').value = "";
  document.getElementById('layanan').value = "";
  document.getElementById('resume').value = "";
  document.getElementById('alamat').value = "";
  document.getElementById('pengecekan').value= "";
  document.getElementById('jabatan').value = "";
  document.getElementById('carring').value = "";
  document.getElementById('jam').value = "";
  document.getElementById('via-grup').value = "";

  // menampilkan hasil ini mah
  const hasilP = document.getElementById('hasil-texbox');
  const hasilDiv = document.getElementById('hasil-dsc');
  const hasilI = document.getElementById('hasil-insera');
  const hasiltankorDsc = document.getElementById('hasil-tanpa-kordinasi-dsc');
  const hasiltankorInsera = document.getElementById('hasil-tanpa-kordinasi-insera');

  // nambahin via grup jika di ceklist
  const grup = document.getElementById('via-grup');

  // untuk menampilkan data dari textbox jika radio button dipilih
    if (radioBiasa.checked) {
      hasilP.textContent = "Menunggu info lebih lanjut.";
      } else if (tanpaKordinasi.checked) {
      hasilP.textContent = `${inputUser.value}`;
      } else if (radioTextbox.checked) {
        if (inputUser.value.trim() === '') {
            hasilP.textContent = "ISI INFORMASI TAMBAHANNYAA WOYY!";
        } else {
            hasilP.textContent = `${inputUser.value}`;
        }
    };  

    // memunculkan via grup nya
    if (grup.checked) {
      grup.textContent = "Via grup,"
    } else {
      grup.textContent= ""
    };

  // Menampilkan data untuk update DSC
 
   hasilDiv.innerHTML = `
    <p>${insera} ${dsc}</p>
    ${perner} / C4 Area / ${jabatan} / Hasil Cek: ${pengecekan}<br>
    Sudah dikordinasikan dengan ${jabatan} ${grup.textContent} ${hasilP.textContent}
    <p>=====================================</p>
  `;

  // Menampilkan data untuk update Insera

  hasilI.innerHTML = `
    <p>${headline}</p>
    Nama Pelanggan / CP: ${pelanggan} ${cp}<br>
    No. Tiket/ No Layanan: ${insera} ${dsc} / ${layanan}<br>
    Resume Case: ${resume}<br>
    Report Date: ${alamat}<br>
    <p></p>
    Hasil Pengecekan:<br>
    -Cek: ${pengecekan}<br>
    Hasil Kordinasi:<br>
    Sudah dikordinasikan dengan ${jabatan} ${grup.textContent} ${hasilP.textContent}</p>
    <p></p>
    Hasil Carring: ${carring}<br>
    Jam Carring: ${jam}<br>
    <p></p>
    Demikian informasinya<br>
    Terima kasih.
  `;

  hasiltankorDsc.innerHTML= `
    <p>${insera} ${dsc}</p>
    <p>${perner} / C4 Area / Tanpa kordinasi,${hasilP.textContent} / Hasil Cek: ${pengecekan}</p>
    <p>${carring}<br>${jam}</p>
    <p>=====================================</p>
  `;

  hasiltankorInsera.innerHTML= `
    <p>${headline}</p>
    Nama Pelanggan / CP: ${pelanggan} ${cp}<br>
    No. Tiket/ No Layanan: ${insera} ${dsc} / ${layanan}<br>
    Resume Case: ${resume}<br>
    Report Date: ${alamat}<br>
    <p></p>
    Hasil Pengecekan:<br>
    -Cek: ${pengecekan}<br>
    <p></p>
    Hasil Kordinasi:<br>
    - Tanpa kordinasi,  ${hasilP.textContent}<br>
    <p></p>
    Hasil Carring: ${carring}<br>
    Jam Carring: ${jam}<br>
    <p> </p>
    Demikian informasinya<br>
    Terima kasih.
  `;

// event untuk memunculkan hasil sesuai kordinasi/tanpa kordinasi
if (tanpaKordinasi.checked) {
  hasilAkhirTanpaKordinasi.style.display = 'block';
  hasilAkhirKordinasi.style.display = 'none';
} else {
  hasilAkhirTanpaKordinasi.style.display = 'none';
  hasilAkhirKordinasi.style.display = 'block';
}

};