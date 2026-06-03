import { useState, useEffect } from "react";
import { getSelectedChild, setSelectedChild } from "../../utils/child";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Card } from "../../components/common/Card";
import { Alert } from "../../components/common/Alert";

import { getChildren } from "../../services/childService";
import { createPrediction } from "../../services/predictionService";

const formatPercent = (value) => `${(Number(value || 0) * 100).toFixed(1)}%`;

const riskDisplay = {
  stunting: "Risiko Stunting",
  gizi_buruk: "Risiko Gizi Buruk",
};

function CekPertumbuhan() {
  const [bb, setBb] = useState("");
  const [tb, setTb] = useState("");

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const [children, setChildren] = useState([]);
  const [child, setChild] = useState(() => getSelectedChild());
  const [childrenLoading, setChildrenLoading] = useState(false);
  const [usia, setUsia] = useState(0);
  const [tanggalPengukuran, setTanggalPengukuran] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchChildren = async () => {
      setChildrenLoading(true);

      try {
        const response = await getChildren();
        const childList = response.data || [];

        if (!isMounted) return;

        setChildren(childList);

        const savedChild = getSelectedChild();
        const selectedChild =
          childList.find((item) => item.id === savedChild?.id) ||
          childList[0] ||
          null;

        setChild(selectedChild);

        if (selectedChild) {
          setSelectedChild(selectedChild);
        }
      } catch (error) {
        if (!isMounted) return;

        setError(
          error.response?.data?.message ||
          "Gagal memuat data anak"
        );
      } finally {
        if (isMounted) {
          setChildrenLoading(false);
        }
      }
    };

    fetchChildren();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!child || !tanggalPengukuran) return;

      const birthDate = new Date(child.birth_date);
      const measureDate = new Date(tanggalPengukuran);

      let months =
        (measureDate.getFullYear() - birthDate.getFullYear()) * 12 +
        (measureDate.getMonth() - birthDate.getMonth());

      if (measureDate.getDate() < birthDate.getDate()) {
        months--;
      }

     setUsia(months);
    }, [child, tanggalPengukuran]);

  const handleSelectChild = (childId) => {
    const selectedChild = children.find((item) => item.id === childId);

    if (!selectedChild) return;

    setChild(selectedChild);
    setSelectedChild(selectedChild);
    setResult(null);
  };

  const handleCheck = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!child) {
      setError("Silakan pilih anak terlebih dahulu di menu Data & Riwayat");
      setLoading(false);
      return;
    }

    if (!bb || !tb || !tanggalPengukuran) {
      setError("Semua field wajib diisi");
      setLoading(false);
      return;
    }

    const bbNum = parseFloat(bb);
    const tbNum = parseFloat(tb);
    
    if (bbNum < 1 || bbNum > 30) {
      setError("Berat badan harus antara 1 - 30 kg");
      setLoading(false);
      return;
    }

    if (tbNum < 30 || tbNum > 130) {
      setError("Tinggi badan harus antara 30 - 130 cm");
      setLoading(false);
      return;
    }

    try {

      const today = new Date();

      if (new Date(tanggalPengukuran) > today) {
        setError("Tanggal pengukuran tidak boleh melebihi hari ini");
        setLoading(false);
        return;
      }

      const response = await createPrediction({
        child_id: child.id,
        weight: parseFloat(bb),
        height: parseFloat(tb),
        measurement_date: tanggalPengukuran
      });


      setResult({
        status: response.prediction,
        probability: response.probability,
        bmi: response.bmi,
        risks: response.risks || {},
        rekomendasi: response.rekomendasi,
        foodRecommendations: response.food_recommendations
      });

      

      setAlert({
        message: "Prediksi berhasil disimpan",
        type: "success"
      });

      setBb("");
      setTb("");

      } catch (error) {
          console.log("STATUS:", error.response?.status);
          console.log("DATA:", error.response?.data);

        setError(
          error.response?.data?.message ||
          "Gagal melakukan prediksi"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="space-y-8 min-h-screen pb-20">
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Cek Pertumbuhan</h1>
        <p className="text-slate-500 mt-2">Analisis status gizi anak secara instan berdasarkan berat dan tinggi badan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* SIDEBAR / INFO */}
        <div className="space-y-6">
          {/* DATA ANAK TERPILIH */}
          <Card title="Anak Terpilih">
            {childrenLoading ? (
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm text-slate-500 font-semibold">
                Memuat data anak...
              </div>
            ) : children.length > 0 ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-widest text-slate-400 ml-1">
                    Pilih Anak
                  </label>
                  <select
                    value={child?.id || ""}
                    onChange={(e) => handleSelectChild(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-slate-700"
                  >
                    {children.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.full_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-lg leading-tight">{child?.full_name}</h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                      Siap untuk dianalisis
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3">
                <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <p className="text-sm text-amber-700 font-medium">
                  Belum ada data anak. Tambahkan profil anak terlebih dahulu di menu <strong>Data & Riwayat</strong>.
                </p>
              </div>
            )}
          </Card>

          {/* HASIL ANALISIS */}
          {result && (
            <Card title="Hasil Analisis" className="border-t-4 border-t-blue-600 animate-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-5">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Kesimpulan Skrining</p>
                  <span
                    className={`px-6 py-2 rounded-full text-sm font-black shadow-sm ${
                      result.status === "Normal"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {result.status}
                  </span>
                  <p className="text-xs text-slate-500 mt-3 font-semibold">
                    BMI: {Number(result.bmi || 0).toFixed(2)} kg/m2
                  </p>
                </div>

                <div className="space-y-3">
                  {Object.entries(result.risks || {}).map(([target, risk]) => (
                    <div key={target} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">
                            {riskDisplay[target] || target}
                          </p>
                          <p className="text-2xl font-black text-slate-900 mt-1">
                            {formatPercent(risk.probability)}
                          </p>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-black ${
                            risk.prediction
                              ? "bg-red-100 text-red-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {risk.prediction ? "Terdeteksi" : "Tidak"}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-3 text-xs font-bold text-slate-500">
                        <div className="bg-slate-50 rounded-xl p-3">
                          <p className="text-[10px] uppercase tracking-widest text-slate-400">Threshold</p>
                          <p className="text-slate-800 mt-1">{formatPercent(risk.threshold)}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3">
                          <p className="text-[10px] uppercase tracking-widest text-slate-400">Level Risiko</p>
                          <p className="text-slate-800 mt-1 capitalize">{risk.risk_label}</p>
                        </div>
                      </div>

                      {risk.rule_triggered && risk.rule_reason && (
                        <p className="mt-3 text-xs leading-relaxed font-semibold text-amber-700 bg-amber-50 border border-amber-100 rounded-xl p-3">
                          {risk.rule_reason}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 text-blue-900">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4" /></svg>
                    </div>
                    <p className="text-xs font-extrabold uppercase tracking-widest text-blue-600">Rekomendasi</p>
                  </div>
                  <p className="text-sm leading-relaxed font-semibold">
                    {result.rekomendasi || "Gunakan hasil ini sebagai skrining awal dan tetap validasi dengan tenaga kesehatan."}
                  </p>
                </div>

                {result.foodRecommendations && (
                  <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 text-amber-950">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 bg-amber-500 text-white rounded-lg flex items-center justify-center">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6l4 2" /></svg>
                      </div>
                      <p className="text-xs font-extrabold uppercase tracking-widest text-amber-700">Rekomendasi Makanan</p>
                    </div>

                    <p className="text-sm font-black text-amber-950 mb-2">
                      {result.foodRecommendations.title}
                    </p>

                    <ul className="space-y-2">
                      {(result.foodRecommendations.items || []).map((item) => (
                        <li key={item} className="text-sm leading-relaxed font-semibold flex gap-2">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    {result.foodRecommendations.note && (
                      <p className="text-xs text-amber-700 mt-4 font-medium leading-relaxed">
                        {result.foodRecommendations.note}
                      </p>
                    )}
                  </div>
                )}

                <Button variant="secondary" className="w-full text-xs" onClick={() => setResult(null)}>Hapus Hasil</Button>
              </div>
            </Card>
          )}
        </div>

        {/* FORM INPUT */}
        <div className="lg:col-span-2">
          <Card title="Input Pengukuran" subtitle="Masukkan data berat dan tinggi badan terbaru">
            <form onSubmit={handleCheck} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Berat Badan (kg)"
                  type="number"
                  step="0.1"
                  placeholder="Contoh: 1.0"
                  value={bb}
                  onChange={(e) => setBb(e.target.value)}
                />

                <Input
                  label="Tinggi Badan (cm)"
                  type="number"
                  step="0.1"
                  placeholder="Contoh: 30.0"
                  value={tb}
                  onChange={(e) => setTb(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-700 ml-1">
                  Tanggal Pengukuran
                </label>

                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="date"
                    required
                    max={new Date().toISOString().split("T")[0]}
                    value={tanggalPengukuran}
                    onChange={(e) => setTanggalPengukuran(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
                  />

                  <div className="bg-blue-600 text-white rounded-[1.5rem] px-8 py-4 flex items-center justify-center min-w-[140px] shadow-lg shadow-blue-100">
                    <div className="text-center">
                      <p className="text-3xl font-black leading-none">{usia}</p>
                      <p className="text-[10px] uppercase tracking-widest font-bold mt-1 opacity-80">Bulan</p>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 font-medium italic ml-1">
                  *Usia dihitung secara otomatis berdasarkan tanggal yang Anda pilih.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in shake duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-5 text-lg shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menganalisis...
                  </div>
                ) : (
                  "Analisis Pertumbuhan Sekarang"
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CekPertumbuhan;
