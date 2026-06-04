import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

function Sidebar() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  
    navigate('/login');
  };

  const menuClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold transition-all duration-300 ${
      isActive
        ? "bg-blue-600 text-white shadow-lg shadow-blue-200 translate-x-1"
        : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
    }`;

  return (
    <div className="w-72 bg-white border-r border-slate-100 h-screen p-6 flex flex-col shrink-0">
      {/* Logo / Title */}
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          SmartGrowth
        </h2>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-2">
        <NavLink to="/dashboard" className={menuClass}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          Dashboard
        </NavLink>

        <NavLink to="/data-anak" className={menuClass}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          Data & Riwayat
        </NavLink>

        <NavLink to="/cek-pertumbuhan" className={menuClass}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          Cek Pertumbuhan
        </NavLink>
      </nav>

      {/* Footer / Logout */}
      <div className="mt-auto pt-6 border-t border-slate-100">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold text-red-500 hover:bg-red-50 transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Keluar Akun
        </button>
        <p className="mt-6 text-[10px] text-slate-400 font-medium uppercase tracking-widest text-center">
          © 2026 SmartGrowth Analytics
        </p>
      </div>
    </div>
  );
}

export default Sidebar;
