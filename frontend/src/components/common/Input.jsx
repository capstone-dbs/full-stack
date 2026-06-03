export function Input({ label, error, className = "", ...props }) {
  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700 ml-1">
          {label}
        </label>
      )}
      <input
        className={`w-full p-3 bg-gray-50 border rounded-xl outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:bg-white ${
          error ? "border-red-400 focus:ring-red-500" : "border-gray-200 focus:border-transparent"
        }`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500 ml-1 font-medium animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}
