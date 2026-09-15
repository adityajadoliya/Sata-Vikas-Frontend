import { useNavigate } from 'react-router-dom';
import { Eye, ArrowUpDown, Clock, Wrench, ChevronRight } from 'lucide-react';

export default function EntryTable({ logs, loading }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="table-container p-12 text-center text-slate-500 text-sm">
        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
        Loading production entries...
      </div> 
    );
  }

  if (!logs.length) {
    return (
      <div className="table-container p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
          <Wrench size={24} className="text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-600">No production entries found</p>
        <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or upload a new form.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Mobile Card List (Visible on screens < 640px) */}
      <div className="block sm:hidden space-y-3">
        {logs.map((log) => (
          <div
            key={log.id}
            onClick={() => navigate(`/form/${log.id}`)}
            className="card p-4 hover:border-indigo-300 transition-all cursor-pointer active:scale-[0.99] touch-manipulation"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                #{log.id}
              </span>
              <span className={`badge ${
                log.shift === 'A' ? 'bg-blue-100 text-blue-700' :
                log.shift === 'B' ? 'bg-amber-100 text-amber-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                Shift {log.shift}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Date &amp; Machine</span>
                <span className="font-medium text-slate-800">{log.date} · {log.machineNo}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">QA Cell</span>
                <span className="font-medium text-slate-800">{log.qaCell || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Production</span>
                <span className="font-bold text-emerald-700">{log.totalProduction} pcs</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Loss</span>
                <span className={`font-bold ${log.totalLossMin > 30 ? 'text-red-600' : log.totalLossMin > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                  {log.totalLossMin > 0 ? `${log.totalLossMin} min` : '0 min'}
                </span>
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 truncate max-w-[180px]">By: {log.uploadedBy}</span>
              <span className="inline-flex items-center gap-1 font-semibold text-indigo-600">
                View Sheet <ChevronRight size={14} />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View (Visible on screens >= 640px) */}
      <div className="hidden sm:block table-container overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="bg-slate-50/80">
              <th className="table-header">
                <span className="flex items-center gap-1">Log ID <ArrowUpDown size={12} /></span>
              </th>
              <th className="table-header">Date</th>
              <th className="table-header">Shift</th>
              <th className="table-header">Machine No.</th>
              <th className="table-header">QA Cell</th>
              <th className="table-header">Part No</th>
              <th className="table-header">
                <span className="flex items-center gap-1">Total Prod. <ArrowUpDown size={12} /></span>
              </th>
              <th className="table-header">
                <span className="flex items-center gap-1 text-red-500">Loss (Min) <Clock size={12} /></span>
              </th>
              <th className="table-header">Uploaded By</th>
              <th className="table-header text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, idx) => (
              <tr key={log.id} className="table-row" style={{ animationDelay: `${idx * 40}ms` }}>
                <td className="table-cell">
                  <span className="font-mono text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                    #{log.id}
                  </span>
                </td>
                <td className="table-cell font-medium">{log.date}</td>
                <td className="table-cell">
                  <span className={`badge ${
                    log.shift === 'A' ? 'bg-blue-100 text-blue-700' :
                    log.shift === 'B' ? 'bg-amber-100 text-amber-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    Shift {log.shift}
                  </span>
                </td>
                <td className="table-cell font-mono text-xs">{log.machineNo}</td>
                <td className="table-cell">{log.qaCell}</td>
                <td className="table-cell">
                  <div className="text-xs">
                    <span className="font-medium">{log.partNo1}</span>
                    {log.partNo2 && (
                      <span className="text-slate-400 ml-1">/ {log.partNo2}</span>
                    )}
                  </div>
                </td>
                <td className="table-cell">
                  <span className="font-semibold text-emerald-700">{log.totalProduction}</span>
                </td>
                <td className="table-cell">
                  <span className={`font-semibold ${log.totalLossMin > 30 ? 'text-red-600' : log.totalLossMin > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                    {log.totalLossMin > 0 ? `${log.totalLossMin} min` : '—'}
                  </span>
                </td>
                <td className="table-cell text-slate-600">{log.uploadedBy}</td>
                <td className="table-cell text-center">
                  <button
                    onClick={() => navigate(`/form/${log.id}`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                               text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer"
                  >
                    <Eye size={14} />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
