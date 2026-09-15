import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Search, Calendar, SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';

export default function FilterBar({ filters, setFilters }) {
  const { isAdmin } = useAuth();
  const [mobileExpanded, setMobileExpanded] = useState(false);

  if (!isAdmin) return null;

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  const clearFilters = () => {
    setFilters({ dateFrom: '', dateTo: '', shift: '', machineNo: '', search: '' });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="card p-3 sm:p-4 mb-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setMobileExpanded(!mobileExpanded)}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 sm:pointer-events-none cursor-pointer"
        >
          <SlidersHorizontal size={16} className="text-indigo-500" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
          )}
          <span className="sm:hidden text-slate-400 text-xs ml-1">
            {mobileExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </button>

        {hasActiveFilters && (
          <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-600 transition-colors cursor-pointer">
            <X size={14} />
            Clear All
          </button>
        )}
      </div>

      {/* Filter Inputs Grid — Collapsible on mobile, always visible on sm+ */}
      <div className={`mt-3 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3 ${
        mobileExpanded ? 'grid' : 'hidden sm:grid'
      }`}>
        {/* Date From */}
        <div>
          <label className="block text-[10px] sm:text-[11px] font-medium text-slate-500 mb-1 uppercase tracking-wider">From Date</label>
          <div className="relative">
            <Calendar size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => updateFilter('dateFrom', e.target.value)}
              className="input pl-8 !py-1.5 text-xs"
            />
          </div>
        </div>

        {/* Date To */}
        <div>
          <label className="block text-[10px] sm:text-[11px] font-medium text-slate-500 mb-1 uppercase tracking-wider">To Date</label>
          <div className="relative">
            <Calendar size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => updateFilter('dateTo', e.target.value)}
              className="input pl-8 !py-1.5 text-xs"
            />
          </div>
        </div>

        {/* Shift */}
        <div>
          <label className="block text-[10px] sm:text-[11px] font-medium text-slate-500 mb-1 uppercase tracking-wider">Shift</label>
          <select
            value={filters.shift}
            onChange={(e) => updateFilter('shift', e.target.value)}
            className="select !py-1.5 text-xs"
          >
            <option value="">All Shifts</option>
            <option value="A">Shift A</option>
            <option value="B">Shift B</option>
            <option value="C">Shift C</option>
          </select>
        </div>

        {/* Machine No */}
        <div>
          <label className="block text-[10px] sm:text-[11px] font-medium text-slate-500 mb-1 uppercase tracking-wider">Machine No</label>
          <input
            type="text"
            value={filters.machineNo}
            onChange={(e) => updateFilter('machineNo', e.target.value)}
            placeholder="e.g. MC-201"
            className="input !py-1.5 text-xs"
          />
        </div>

        {/* Search */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-[10px] sm:text-[11px] font-medium text-slate-500 mb-1 uppercase tracking-wider">Search</label>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              placeholder="Name, Part, Machine..."
              className="input pl-8 !py-1.5 text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
