export function Button({ children, onClick, type = "button", variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-red-100",
    success: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-100",
    warning: "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-100",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl font-semibold transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
