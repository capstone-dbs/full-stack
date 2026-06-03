import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const token = localStorage.getItem("token");
  const tokenExpiry = localStorage.getItem("tokenExpiry");
  const isLogin = !!token && (!tokenExpiry || Date.now() < Number(tokenExpiry));

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCTAClick = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-500 selection:text-white relative overflow-hidden">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-400/10 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-15%] w-[600px] h-[600px] rounded-full bg-indigo-400/10 blur-[130px] pointer-events-none"></div>
      <div className="absolute top-[40%] right-[-20%] w-[500px] h-[500px] rounded-full bg-emerald-400/5 blur-[120px] pointer-events-none"></div>

      {/* 1. NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">
                SmartGrowth
              </span>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => scrollToSection("home")}
                className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection("features")}
                className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection("about")}
                className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
              >
                About
              </button>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2.5 text-slate-700 hover:text-blue-600 font-bold text-sm transition-colors"
              >
                Masuk
              </button>

              <button
                onClick={() => navigate("/register")}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-100"
              >
                Daftar Gratis
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex flex-col gap-3 mt-4">
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2.5 text-slate-700 hover:text-blue-600 font-bold text-sm transition-colors text-left"
              >
                Masuk
              </button>

              <button
                onClick={() => navigate("/register")}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-100"
              >
                Daftar Gratis
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Flyout Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200/50 bg-white/95 backdrop-blur-lg animate-in slide-in-from-top-4 duration-250">
            <div className="px-4 pt-4 pb-6 space-y-3">
              <button
                onClick={() => scrollToSection("home")}
                className="block w-full text-left px-3 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="block w-full text-left px-3 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="block w-full text-left px-3 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all"
              >
                About
              </button>
              </div>
              
              {/* Desktop Actions */}
              <div className="hidden md:flex items-center gap-4">
                {isLogin ? (
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-100 flex items-center gap-2"
                  >
                    <span>Ke Dashboard</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => navigate("/login")}
                      className="px-5 py-2.5 text-slate-700 hover:text-blue-600 font-bold text-sm transition-colors"
                    >
                      Masuk
                    </button>

                    <button
                      onClick={() => navigate("/register")}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-100"
                    >
                      Daftar Gratis
                    </button>
                  </>
                )}
              
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section id="home" className="relative pt-10 pb-20 md:pt-16 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 animate-fade-in">
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-black text-blue-700 uppercase tracking-wider">
                  Deteksi Stunting & Tumbuh Kembang Anak
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none">
                Pantau Pertumbuhan <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Anak Secara Cerdas
                </span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-500 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Smart Growth Analytics memberikan kemudahan bagi orang tua dan tenaga kesehatan untuk merekam, menganalisis, dan memantau status gizi serta mendeteksi risiko stunting secara dini secara akurat.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={handleCTAClick}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 hover:shadow-blue-300/50 hover:translate-y-[-2px] transition-all text-base flex items-center justify-center gap-2.5"
                >
                  <span>{isLogin ? "Coba Sekarang" : "Mulai Sekarang"}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
                
                {!isLogin && (
                  <button
                    onClick={() => navigate("/login")}
                    className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-2xl border border-slate-200 shadow-md hover:translate-y-[-2px] transition-all text-base flex items-center justify-center gap-2"
                  >
                    <span>Masuk ke Akun</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Graphic */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end animate-in fade-in zoom-in duration-700">
              <div className="relative w-full max-w-lg lg:max-w-xl">
                {/* Floating Widget 1 */}
                <div className="absolute top-[10%] left-[-5%] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3.5 z-20 animate-bounce duration-[4000ms]">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status Gizi</p>
                    <p className="text-sm font-extrabold text-slate-900">Pertumbuhan Normal</p>
                  </div>
                </div>

                {/* Floating Widget 2 */}
                <div className="absolute bottom-[10%] right-[-5%] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3.5 z-20 animate-bounce duration-[5000ms] delay-200">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Risiko Stunting</p>
                    <p className="text-sm font-extrabold text-slate-900">Sangat Rendah (Aman)</p>
                  </div>
                </div>

                {/* Main Image Frame */}
                <div className="bg-gradient-to-tr from-blue-100 to-indigo-100 p-3 rounded-[2.5rem] shadow-2xl shadow-slate-300/50 border border-white">
                  <div className="overflow-hidden rounded-[2rem] bg-white relative aspect-video sm:aspect-square flex items-center justify-center">
                    <img 
                      src="/health_analytics_hero.png" 
                      alt="Smart Growth Child Health Analytics Vector Illustration" 
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. STATISTICS SECTION */}
      <section className="bg-blue-600 py-12 text-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-blue-500/40">
            <div className="pt-6 sm:pt-0">
              <p className="text-4xl sm:text-5xl font-black tracking-tight mb-1">100+</p>
              <p className="text-xs sm:text-sm font-bold text-blue-100 uppercase tracking-widest">Pemeriksaan Selesai</p>
            </div>
            <div className="pt-6 sm:pt-0">
              <p className="text-4xl sm:text-5xl font-black tracking-tight mb-1">95%</p>
              <p className="text-xs sm:text-sm font-bold text-blue-100 uppercase tracking-widest">Akurasi Analisis Gizi</p>
            </div>
            <div className="pt-6 sm:pt-0">
              <p className="text-4xl sm:text-5xl font-black tracking-tight mb-1">50+</p>
              <p className="text-xs sm:text-sm font-bold text-blue-100 uppercase tracking-widest">Pengguna Aktif</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section id="features" className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Fitur Pintar Utama</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Solusi Lengkap Monitoring Tumbuh Kembang
            </h2>
            <p className="text-slate-500 font-medium text-sm sm:text-base leading-relaxed">
              Pantau kesehatan anak secara terperinci dengan standar WHO untuk mencegah potensi keterlambatan pertumbuhan anak secara dini.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Fitur 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-100/80 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 hover:translate-y-[-4px] transition-all duration-300 group">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Cek Pertumbuhan Anak</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Ukur dan hitung indeks massa tubuh, tinggi badan menurut umur, serta berat badan secara instan berbasis standar WHO.
              </p>
            </div>

            {/* Fitur 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-100/80 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 hover:translate-y-[-4px] transition-all duration-300 group">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Dashboard Statistik</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Tinjau indikator kesehatan anak secara menyeluruh melalui ringkasan dashboard yang mudah dipahami orang tua.
              </p>
            </div>

            {/* Fitur 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-100/80 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 hover:translate-y-[-4px] transition-all duration-300 group">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Grafik Pertumbuhan</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Visualisasikan tren pertumbuhan anak dari bulan ke bulan menggunakan kurva interaktif pertumbuhan WHO yang interaktif.
              </p>
            </div>

            {/* Fitur 4 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-100/80 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 hover:translate-y-[-4px] transition-all duration-300 group">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Riwayat Pemeriksaan</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Akses semua catatan rekam medis tumbuh kembang anak masa lalu untuk memantau kemajuan secara berkala.
              </p>
            </div>

            {/* Fitur 5 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-100/80 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 hover:translate-y-[-4px] transition-all duration-300 group">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Deteksi Risiko Stunting</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Algoritma cerdas yang mendeteksi dini jika tinggi badan anak berada di bawah ambang batas normal berdasarkan usianya.
              </p>
            </div>

            {/* Fitur Extra / Simplicity */}
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-8 rounded-3xl shadow-xl text-white flex flex-col justify-between group hover:translate-y-[-4px] transition-all duration-300">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Pemantauan Terintegrasi</h3>
                <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
                  Kami menyederhanakan data medis yang rumit menjadi grafik yang interaktif dan rekomendasi kesehatan yang praktis untuk si kecil.
                </p>
              </div>
              <button 
                onClick={handleCTAClick}
                className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white hover:text-blue-200 transition-colors group/btn"
              >
                <span>Coba Sekarang</span>
                <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section id="about" className="py-20 sm:py-28 bg-slate-100/60 border-y border-slate-200/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-3">
            <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Cara Kerja Aplikasi</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Tiga Langkah Mudah Memulai
            </h2>
            <p className="text-slate-500 font-medium text-sm sm:text-base leading-relaxed">
              Hanya butuh waktu kurang dari 5 menit untuk mendaftarkan dan menganalisis tinggi serta berat badan anak Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Desktop Connector Line */}
            <div className="hidden md:block absolute top-[28%] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-300 via-indigo-300 to-blue-300/10 pointer-events-none z-0"></div>

            {/* Langkah 1 */}
            <div className="flex flex-col items-center text-center space-y-4 relative z-10 group">
              <div className="w-16 h-16 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center text-xl font-black text-blue-600 shadow-lg group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-950">Tambah Data Anak</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs">
                Masukkan informasi dasar anak Anda seperti Nama Lengkap, Tanggal Lahir, Jenis Kelamin, dan nama Orang Tua.
              </p>
            </div>

            {/* Langkah 2 */}
            <div className="flex flex-col items-center text-center space-y-4 relative z-10 group">
              <div className="w-16 h-16 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center text-xl font-black text-blue-600 shadow-lg group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-950">Input Pertumbuhan</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs">
                Isi data pengukuran fisik secara berkala meliputi berat badan (kg), tinggi badan (cm), dan tanggal penimbangan dilakukan.
              </p>
            </div>

            {/* Langkah 3 */}
            <div className="flex flex-col items-center text-center space-y-4 relative z-10 group">
              <div className="w-16 h-16 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center text-xl font-black text-blue-600 shadow-lg group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-950">Lihat Analisis</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs">
                Dapatkan hasil analisis gizi dan status risiko stunting instan beserta kurva pertumbuhan visualisasi WHO.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. CTA SECTION */}
      <section className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-700 text-white rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-16 text-center shadow-2xl shadow-blue-200/50 relative overflow-hidden group">
            
            {/* Background design elements */}
            <div className="absolute top-[-50%] right-[-30%] w-[400px] h-[400px] rounded-full bg-white/10 blur-[80px] pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
            <div className="absolute bottom-[-50%] left-[-30%] w-[400px] h-[400px] rounded-full bg-indigo-500/20 blur-[80px] pointer-events-none"></div>

            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Mulai Pantau Kesehatan <br /> Anak Sekarang
              </h2>
              <p className="text-blue-100 text-base sm:text-lg font-medium leading-relaxed">
                Lindungi masa depan si kecil dan hindari bahaya stunting sedini mungkin. Bergabunglah secara gratis hari ini.
              </p>
              <div className="pt-4">
                <button
                  onClick={handleCTAClick}
                  className="px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 font-black rounded-2xl shadow-lg transition-all transform hover:scale-105 inline-flex items-center gap-2.5 text-base"
                >
                  <span>{isLogin ? "Mulai Daftar Sekarang" : "Mulai Daftar Sekarang"}</span>
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Left side brand */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="text-lg font-black text-white tracking-tight">SmartGrowth</span>
            </div>

            {/* Mid text Jatimpride */}
            <div className="text-center text-xs sm:text-sm font-medium">
              Dibuat dengan ❤️ oleh <span className="text-blue-400 font-bold">Tim Jatimpride -1</span>
            </div>

            {/* Right copyright */}
            <div className="text-center md:text-right text-xs sm:text-sm font-medium">
              &copy; {new Date().getFullYear()} SmartGrowth Analytics. Semua Hak Dilindungi.
            </div>

          </div>
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;
