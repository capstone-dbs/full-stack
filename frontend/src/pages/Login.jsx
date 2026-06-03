import { useState } from "react";
import { login } from "../utils/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/common/Button";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || ""
  );

  const handleLogin = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    if (!email.trim() || !password) {

      setError(
        "Email dan password wajib diisi!"
      );

      setLoading(false);
      return;
    }

    try {

      const response = await login(
        email,
        password
      );

      if (!response.success) {

        setError(response.message);
        setLoading(false);
        return;
      }

      navigate("/dashboard");

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Login gagal"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-slate-50 via-blue-50/50 to-indigo-50/40 p-4 relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-400/10 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-lg bg-white/80 backdrop-blur-xl p-6 sm:p-10 rounded-3xl sm:rounded-[2.5rem] shadow-2xl shadow-slate-200/80 border border-white/60 relative z-10 my-8">
        
        {/* Brand/Logo emblem */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 mb-4 transform hover:rotate-6 transition-transform">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Selamat Datang</h2>
          <p className="text-slate-500 mt-1 text-sm text-center">Silakan masuk untuk mengelola dan memantau pertumbuhan anak Anda</p>
        </div>

        {/* Notifikasi Registrasi Sukses */}
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 text-xs sm:text-sm font-semibold flex items-start gap-2.5 animate-in fade-in duration-300">
            <svg className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <span>{successMessage}</span>
            </div>
            <button 
              onClick={() => setSuccessMessage("")}
              className="text-emerald-500 hover:text-emerald-700 font-bold transition-colors text-xs ml-1 shrink-0"
            >
              Tutup
            </button>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Kolom Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
              Alamat Email
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-2xl outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white text-slate-800 placeholder-slate-400 font-medium"
              />
            </div>
          </div>

          {/* Kolom Kata Sandi */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Kata Sandi
              </label>
              <span
                onClick={() => navigate("/forgot-password")}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer transition-colors"
              >
                Lupa Password?
              </span>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-3.5 bg-slate-50/80 border border-slate-200 rounded-2xl outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white text-slate-800 placeholder-slate-400 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-500 transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.025 10.025 0 012.25-3.67M21 21l-2-2m-2-2L3 3m15.364 15.364l-1.351-1.351m-2.195-2.195L12 12m0 0L9.172 9.172m0 0L7.82 7.82m10.822 5.586a10.025 10.025 0 002.25-3.67c-1.274-4.057-5.064-7-9.542-7-1.275 0-2.482.25-3.58.69M12 9a3 3 0 013 3m-3-3a3 3 0 00-3 3" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Pesan Kesalahan */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs sm:text-sm font-semibold flex items-start gap-2.5 animate-in fade-in duration-200">
              <svg className="w-5 h-5 shrink-0 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Tombol Masuk */}
          <Button
            type="submit"
            className="w-full py-4 text-base font-bold bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 rounded-2xl flex items-center justify-center gap-2 mt-6"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Memproses Masuk...</span>
              </>
            ) : (
              <span>Masuk Sekarang</span>
            )}
          </Button>

          {/* Tautan ke Registrasi */}
          <p className="text-center text-sm text-slate-500 font-medium pt-2">
            Belum memiliki akun?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-600 font-bold cursor-pointer hover:text-blue-700 hover:underline transition-colors ml-1"
            >
              Daftar Gratis
            </span>
          </p>

        </form>
      </div>
    </div>
  );
}

export default Login;
