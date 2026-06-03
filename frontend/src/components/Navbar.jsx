import { getSelectedChild } from "../utils/child";

function Navbar() {
  const child = getSelectedChild();
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const user =
    JSON.parse(localStorage.getItem("user"));

  const userName =
    user?.name ||
    user?.email?.split("@")[0] ||
    "User";

  const userRole =
    user?.role || "parent";

  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex justify-between items-center sticky top-0 z-30">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">
          {today}
        </p>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Halo, {userName}
        </h1>
      </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 leading-none">
              {userName}
            </p>
            <p className="text-[10px] text-slate-400 font-medium uppercase mt-1">
              {userRole === "admin" ? "Admin Account" : "Parent Account"}
            </p>
          </div>
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 border border-slate-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
        </div>
      </div>
  );
}

export default Navbar;
