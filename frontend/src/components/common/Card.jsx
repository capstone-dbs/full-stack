export function Card({ children, title, subtitle, className = "", headerAction, ...props }) {
  return (
    <div className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden ${className}`} {...props}>
      {(title || subtitle || headerAction) && (
        <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center gap-4">
          <div>
            {title && <h3 className="font-bold text-gray-800 text-lg leading-tight">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
