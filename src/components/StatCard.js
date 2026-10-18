export default function StatCard({ title, value, icon: Icon, color, subtitle }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 lg:p-6 hover:shadow-md transition-shadow duration-200 shadow-2xs">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 tracking-tight">{value}</p>
          {subtitle && <p className="text-[11px] sm:text-xs text-gray-400 mt-1 truncate">{subtitle}</p>}
        </div>
        <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center shrink-0 ${colorMap[color] || colorMap.indigo}`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>
    </div>
  );
}
