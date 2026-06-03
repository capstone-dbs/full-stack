import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/parent/Dashboard";
import DataAnak from "./pages/parent/DataAnak";
import CekPertumbuhan from "./pages/parent/CekPertumbuhan";
import MainLayout from "./layouts/MainLayout";


// 🔐 PROTECTED ROUTE WRAPPER
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userRole =
    localStorage.getItem("role") ||
    user?.user_metadata?.role ||
    user?.app_metadata?.role ||
    "parent";

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && role !== userRole) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 text-slate-800 p-6 text-center select-none animate-in fade-in duration-300">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 border border-red-100 shadow-xl shadow-red-50 animate-bounce duration-[3000ms]">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Akses ditolak</h1>
        <p className="text-slate-500 font-semibold text-sm max-w-sm leading-relaxed mb-6">
          Anda tidak memiliki izin yang diperlukan untuk mengakses halaman ini.
        </p>
        <button 
          onClick={() => window.location.href = "/"}
          className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return children;
};

// 🔓 PUBLIC ROUTE WRAPPER
const PublicRoute = ({ children }) => {
  const isLogin = localStorage.getItem("isLogin") === "true";
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC LANDING PAGE */}
        <Route path="/" element={<LandingPage />} />

        {/* AUTH */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

        {/* PARENT */}
        <Route path="/dashboard" element={<ProtectedRoute role="parent"><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
        <Route path="/data-anak" element={<ProtectedRoute role="parent"><MainLayout><DataAnak /></MainLayout></ProtectedRoute>} />
        <Route path="/cek-pertumbuhan" element={<ProtectedRoute role="parent"><MainLayout><CekPertumbuhan /></MainLayout></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<div className="flex items-center justify-center h-screen font-bold text-2xl">404 | Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
