import { useState, useEffect } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Card } from "../../components/common/Card";
import { Alert } from "../../components/common/Alert";

import {getChildren, createChild, updateChild, deleteChild} from "../../services/childService";
import { setSelectedChild } from "../../utils/child";
import { getPredictionHistories } from "../../services/predictionService";

const hasGiziBurukRisk = (predictionResult = "") =>
  predictionResult.toLowerCase().includes("gizi buruk");

const hasStuntingRisk = (predictionResult = "") =>
  predictionResult.toLowerCase().includes("stunting");

const getFoodRecommendations = (ageMonths, predictionResult = "") => {
  const age = Number(ageMonths);
  const hasRisk = hasStuntingRisk(predictionResult) || hasGiziBurukRisk(predictionResult);

  if (!hasRisk) {
    return "Pertahankan pola makan bergizi seimbang dan pantau pertumbuhan secara rutin.";
  }

  if (age >= 6 && age <= 8) {
    return "Bubur Singkong Isi Ikan dan Ayam dengan Saus Jeruk; Bubur Soto Ayam Santan; Bubur Sup Telur Daging Kacang Merah; Bubur Kanji Rumbi Ayam dan Udang; Puding Kentang Ayam dan Telur.";
  }

  if (age >= 9 && age <= 11) {
    return "Nasi Tim Ikan Tuna Telur Puyuh; Nasi Tim Ayam Lele Cincang; Nasi Tim Ikan Telur Sayuran; Tim Bubur Manado Daging dan Udang; Mie Kukus Telur Puyuh.";
  }

  if (age >= 12 && age <= 23) {
    return "Nasi Sup Telur Puyuh Bola Tahu Ayam; Nasi Soto Ayam Kuah Kuning; Sup Telur Puyuh Ikan Air Tawar Labu Kuning; Nasi Ikan Kuah Kuning; Nugget Tempe Ayam Sayuran.";
  }

  if (age >= 24 && age <= 59) {
    return "Nasi Ikan Lele Katsu Ceria; Nasi Bakar Ayam Santan; Nasi Masak Ayam Kecap Sayur; Nasi Sup Tabas Udang Sayur; Bola-bola Nasi Isi Rabuk Ikan.";
  }

  return "Konsultasikan hasil skrining dengan tenaga kesehatan untuk rekomendasi makan sesuai usia.";
};


function DataAnak() {
  // --- STATE DATA ---
  const [children, setChildrenState] = useState([]);
  const [allHistory, setAllHistory] = useState([]);
  const [activeChild, setActiveChild] = useState(null);

  // --- STATE FORMS ---
  const [childForm, setChildForm] = useState({ id: null, nama: "", tanggalLahir: "", jenisKelamin: "" });
  const [historyForm, setHistoryForm] = useState({ index: null, bb: "", tb: "", usia: "", status: "" });
  const [showChildForm, setShowChildForm] = useState(false);
  const [showHistoryForm, setShowHistoryForm] = useState(false);

  // --- FILTER & SEARCH ---
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  const [selectedChildData, setSelectedChildData] = useState(null);

const fetchData = async () => {
  try {
    const result = await getChildren();

    setChildrenState(result.data);

    if (result.data.length > 0) {
      setActiveChild(result.data[0]);
    }
  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
    fetchData();
    fetchHistory();
  }, []);
  

  const fetchHistory = async () => {
    try {
      const res = await getPredictionHistories();
      console.log("RAW RESPONSE:", res);
      console.log("FIRST HISTORY:", res.data?.[0]);
      console.log("ALL HISTORY:", res.data);
      
      setAllHistory(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const [alert, setAlert] = useState(null);

  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
  };

  // --- CHILD MANAGEMENT ---
const handleSaveChild = async (e) => {
  e.preventDefault();

  const birthDate = new Date(childForm.tanggalLahir);

  if (birthDate > new Date()) {
    showAlert(
      "Tanggal lahir tidak boleh melebihi tanggal hari ini",
      "error"
    );
    return;
  }

  try {
    if (!childForm.id) {
      await createChild({
        full_name: childForm.nama,
        gender: childForm.jenisKelamin,
        birth_date: childForm.tanggalLahir,
      });
    } else {
      await updateChild(childForm.id, {
        full_name: childForm.nama,
        gender: childForm.jenisKelamin,
        birth_date: childForm.tanggalLahir,
      });
    }

    await fetchData();

    showAlert(
      `Profil anak berhasil ${
        childForm.id ? "diperbarui" : "ditambahkan"
      }!`
    );

    setShowChildForm(false);
      } catch (error) {
        console.error(error);
        showAlert("Gagal menyimpan data", "error");
      }
    };
    
  const handleEditChild = (child) => {
    setChildForm({
      id: child.id,
      nama: child.full_name,
      jenisKelamin: child.gender,
      tanggalLahir: child.birth_date,
    });

    setShowChildForm(true);
  };

  const handleDeleteChild = async (id) => {
  if (confirm("Apakah Anda yakin ingin menghapus data anak ini?")) {
    try {
      await deleteChild(id);

      await fetchData();

      showAlert("Data anak berhasil dihapus", "warning");
    } catch (error) {
      console.error(error);
      showAlert("Gagal menghapus data", "error");
    }
  }
};

  const handleSelectChild = (child) => {
    setActiveChild(child);
    setSelectedChildData(child);

    setSelectedChild(child);
  };

  console.log("child_id history:", allHistory[0]?.child_id);
  console.log("active child id:", activeChild?.id);

  // --- HISTORY MANAGEMENT ---
  const filteredHistory = allHistory
    .filter((h) => h.child_id === activeChild?.id)
    .filter((h) => h.measurement_date.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((h) => statusFilter === "Semua" || h.status === statusFilter);

  const handleDeleteHistory = (indexInFiltered) => {
    if (confirm("Hapus riwayat pemeriksaan ini?")) {
      const itemToDelete = filteredHistory[indexInFiltered];
      const updated = allHistory.filter((h) => h !== itemToDelete);
      setAllHistory(updated);
      localStorage.setItem("growthHistory", JSON.stringify(updated));
      showAlert("Riwayat berhasil dihapus", "warning");
    }
  };

  // const handleEditHistory = (indexInFiltered) => {
  //   const item = filteredHistory[indexInFiltered];
  //   const globalIndex = allHistory.findIndex((h) => h === item);
  //   setHistoryForm({ ...item, index: globalIndex });
  //   setShowHistoryForm(true);
  // };

  // const handleUpdateHistory = (e) => {
  //   e.preventDefault();
  //   const updated = [...allHistory];
    
    // let status = "";
    // let rekomendasi = "";
    // const bbNum = Number(historyForm.bb);
    // const tbNum = Number(historyForm.tb);

    // if (bbNum < 10 || tbNum < 80) {
    //   status = "Risiko Stunting";
    //   rekomendasi = "Perbanyak protein (telur, ikan, susu), sayuran hijau, dan rutin cek ke posyandu.";
    // } else {
    //   status = "Normal";
    //   rekomendasi = "Pertahankan pola makan seimbang dan rutin pantau pertumbuhan.";
    // }

    // updated[historyForm.index] = {
    //   ...historyForm,
    //   bb: bbNum,
    //   tb: tbNum,
    //   usia: Number(historyForm.usia),
    //   status,
    //   rekomendasi
    // };

  //   setAllHistory(updated);
  //   localStorage.setItem("growthHistory", JSON.stringify(updated));
  //   setShowHistoryForm(false);
  //   showAlert("Riwayat pemeriksaan berhasil diperbarui!");
  // };

  const calculateAge = (dob) => {
    if (!dob) return "-";
    const birth = new Date(dob);
    const today = new Date();
    let months = (today.getFullYear() - birth.getFullYear()) * 12;
    months += today.getMonth() - birth.getMonth();
    if (today.getDate() < birth.getDate()) months--;
    return `${months < 0 ? 0 : months} bulan`;
  };

  const getRecommendation = (result) => {
  switch (result?.toLowerCase()) {
    case "normal":
      return "Pertahankan pola makan seimbang dan lakukan pemantauan pertumbuhan secara rutin.";

    case "stunting":
      return "Tingkatkan asupan protein hewani, vitamin, dan konsultasikan ke tenaga kesehatan.";

    case "risiko stunting":
      return "Perbanyak konsumsi protein, susu, sayuran, dan lakukan pemeriksaan berkala.";

    case "risiko gizi buruk":
      return "Segera lakukan pemeriksaan lanjutan dan berikan makanan padat energi serta protein sesuai usia.";

    case "risiko stunting dan gizi buruk":
      return "Segera konsultasi ke tenaga kesehatan dan prioritaskan makanan padat energi serta protein sesuai usia.";

    default:
      return "-";
    }
  };

  return (
    <div className="space-y-10 min-h-screen pb-20">
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Data & Riwayat Anak</h1>
          <p className="text-slate-500 mt-1">Kelola profil anak dan pantau perkembangan mereka secara berkala.</p>
        </div>
        <Button 
          onClick={() => { setChildForm({ id: null, nama: "", tanggalLahir: "", jenisKelamin: "" }); setShowChildForm(true); }}
          className="w-full md:w-auto px-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Tambah Profil Anak
        </Button>
      </header>

      {/* MODAL CHILD FORM */}
      {showChildForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <Card 
            title={childForm.id ? 'Edit Profil' : 'Profil Baru'} 
            className="w-full max-w-md animate-in zoom-in-95 duration-200"
            headerAction={
              <button onClick={() => setShowChildForm(false)} className="text-slate-400 hover:text-slate-600 transition p-1 rounded-lg hover:bg-slate-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            }
          >
            <form onSubmit={handleSaveChild} className="space-y-5">
              <Input 
                label="Nama Lengkap"
                required
                placeholder="Contoh: Budi Santoso"
                value={childForm.nama} 
                onChange={(e) => setChildForm({...childForm, nama: e.target.value})}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 ml-1">Jenis Kelamin</label>
                  <select 
                    required
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
                    value={childForm.jenisKelamin} 
                    onChange={(e) => setChildForm({...childForm, jenisKelamin: e.target.value})}
                  >
                    <option value="">Pilih</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <Input 
                  label="Tanggal Lahir"
                  type="date"
                  required
                  value={childForm.tanggalLahir} 
                  onChange={(e) => setChildForm({...childForm, tanggalLahir: e.target.value})}
                />
              </div>
              <div className="pt-4 flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setShowChildForm(false)}>Batal</Button>
                <Button type="submit" className="flex-[2]">Simpan Profil</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* CHILDREN LIST */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Pilih Anak</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {children.map((child) => (
            <div 
              key={child.id} 
              className={`group relative p-6 rounded-[2rem] border-2 transition-all duration-300 cursor-pointer ${
                activeChild?.id === child.id 
                ? "border-blue-500 bg-white shadow-xl shadow-blue-100 -translate-y-1" 
                : "border-transparent bg-white shadow-sm hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5"
              }`}
              onClick={() => handleSelectChild(child)}
            >
              <div className="flex justify-between items-start mb-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${activeChild?.id === child.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <div className="flex gap-2 transition-opacity duration-300">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleEditChild(child); }} 
                    className="p-2.5 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition shadow-lg shadow-amber-200 border border-amber-600/20"
                    title="Edit Data"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteChild(child.id); }} 
                    className="p-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition shadow-lg shadow-red-200 border border-red-600/20"
                    title="Hapus Data"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>


              </div>
              <h4 className="font-extrabold text-slate-900 text-lg truncate mb-1">{child.full_name}</h4>
              <p className="text-slate-400 text-sm font-medium">{calculateAge(child.birth_date)} • {child.gender}</p>
              
              {activeChild?.id === child.id && (
                <div className="absolute bottom-4 right-6">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                </div>
              )}
            </div>
          ))}
          
          {children.length === 0 && (
            <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Belum ada data anak</h4>
              <p className="text-slate-400 mb-8 max-w-xs mx-auto">Silakan tambahkan profil anak Anda untuk mulai memantau pertumbuhan mereka.</p>

            </div>
          )}
        </div>
      </section>

      {/* SELECTED CHILD CONTENT */}
      {activeChild && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart */}
            <Card title="Tren Pertumbuhan" className="lg:col-span-2">
              <div className="w-full pt-4">
                {filteredHistory.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={filteredHistory}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="measurement_date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                      />
                      <Line type="monotone" dataKey="weight" name="Berat (kg)" stroke="#3b82f6" strokeWidth={5} dot={{ r: 6, fill: '#3b82f6', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 9 }} />
                      <Line type="monotone" dataKey="height" name="Tinggi (cm)" stroke="#10b981" strokeWidth={5} dot={{ r: 6, fill: '#10b981', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 9 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-3xl gap-3">
                    <svg className="w-12 h-12 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                    <p className="font-medium">Belum ada data riwayat untuk grafik</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Profile Detail */}
            <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-200 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
              <div className="relative z-10">
                <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">Ringkasan Profil</span>
                <h2 className="text-4xl font-extrabold mt-6 tracking-tight">{activeChild.full_name}</h2>
                <div className="mt-8 space-y-5">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <span className="text-blue-100 text-sm font-medium">Lahir</span>
                    <span className="font-bold">{new Date(activeChild.birth_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <span className="text-blue-100 text-sm font-medium">Gender</span>
                    <span className="font-bold">{activeChild.gender}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <span className="text-blue-100 text-sm font-medium">Total Data</span>
                    <span className="font-bold">{filteredHistory.length} Kali Cek</span>
                  </div>
                </div>
              </div>
              <div className="mt-10 bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/10 relative z-10">
                <p className="text-xs text-blue-50 leading-relaxed italic font-medium">
                  "Pantau terus pertumbuhan {activeChild.full_name.split(' ')[0]} secara rutin untuk memastikan masa depan yang sehat."
                </p>
              </div>
            </div>
          </div>

          {/* HISTORY TABLE */}
          <Card 
            title="Histori Pemeriksaan" 
            headerAction={
              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input 
                    type="text" 
                    placeholder="Cari tanggal..." 
                    className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition w-full sm:w-48 font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            }
          >
            <div className="overflow-x-auto -mx-6 sm:mx-0">
              <table className="w-full">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Tanggal</th>
                    <th className="px-6 py-4 text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">BB / TB</th>
                    <th className="px-6 py-4 text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Usia</th>
                    <th className="px-6 py-4 text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Status gizi</th>
                    <th className="px-6 py-4 text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Gizi buruk</th>
                    <th className="px-6 py-4 text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Rekomendasi</th>
                    <th className="px-6 py-4 text-right text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map((item, idx) => (
                      <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-slate-900">{item.measurement_date}</td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-700">{item.weight}kg</span>
                            <span className="text-slate-300">/</span>
                            <span className="text-sm font-bold text-slate-700">{item.height}cm</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-500">{item.age_months} bulan</td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-sm ${
                            item.prediction_result?.toLowerCase() === 'normal' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {item.prediction_result}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-sm ${
                            hasGiziBurukRisk(item.prediction_result) ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {hasGiziBurukRisk(item.prediction_result) ? 'Terdeteksi' : 'Tidak'}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-500 max-w-xs font-medium">
                          <p className="line-clamp-1 group-hover:line-clamp-none transition-all duration-300 cursor-help"
                            title={getFoodRecommendations(item.age_months, item.prediction_result)}
                            >
                            {getFoodRecommendations(item.age_months, item.prediction_result)}
                          </p>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2 transition-opacity">
                            <button 
                              onClick={() => handleDeleteHistory(idx)} 
                              className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition shadow-lg shadow-red-100 border border-red-600/20"
                              title="Hapus Riwayat"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </td>


                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          </div>
                          <p className="font-bold text-slate-900">Belum ada histori pemeriksaan</p>
                          <p className="text-xs max-w-[200px]">Coba gunakan fitur Cek Pertumbuhan untuk menambah data baru.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* MODAL HISTORY FORM */}
      {showHistoryForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <Card 
            title="Edit Riwayat" 
            className="w-full max-w-md animate-in zoom-in-95 duration-200"
            headerAction={
              <button onClick={() => setShowHistoryForm(false)} className="text-slate-400 hover:text-slate-600 transition p-1 rounded-lg hover:bg-slate-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            }
          >
            <form onSubmit={handleUpdateHistory} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="BB (kg)"
                  required
                  type="number" step="0.1"
                  value={historyForm.bb} 
                  onChange={(e) => setHistoryForm({...historyForm, bb: e.target.value})}
                />
                <Input 
                  label="TB (cm)"
                  required
                  type="number" step="0.1"
                  value={historyForm.tb} 
                  onChange={(e) => setHistoryForm({...historyForm, tb: e.target.value})}
                />
              </div>
              <Input 
                label="Usia (bulan)"
                required
                type="number"
                value={historyForm.usia} 
                onChange={(e) => setHistoryForm({...historyForm, usia: e.target.value})}
              />
              <div className="pt-4 flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setShowHistoryForm(false)}>Batal</Button>
                <Button type="submit" className="flex-[2]">Update Data</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

export default DataAnak;

