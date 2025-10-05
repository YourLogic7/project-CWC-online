const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  perner: { type: String },
  headline: { type: String },
  layanan: { type: String },
  dsc: { type: String },
  insera: { type: String },
  pelanggan: { type: String },
  cp: { type: String },
  resume: { type: String },
  alamat: { type: String },
  pengecekan: { type: String },
  jabatan: { type: String },
  carring: { type: String },
  jam: { type: String },
  inputUser: { type: String },
  jabatanSolver: { type: String },
  unitSolver: { type: String },
  kip: { type: String },
  noPermintaan: { type: String },
  statusPermintaan: { type: String },
  detailPermintaan: { type: String },
  namaSolver: { type: String },
  cpSolver: { type: String },
  radioChoice: { type: String },
  viaGrup: { type: Boolean },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Submission', SubmissionSchema);
