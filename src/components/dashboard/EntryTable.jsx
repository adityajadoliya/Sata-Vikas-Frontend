import { useNavigate } from 'react-router-dom';
import { Eye, ArrowUpDown, Clock, Wrench, ChevronRight, ListFilter, RefreshCw, Calendar } from 'lucide-react';
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll';
import { formatLogDate, formatLogTime } from '../../utils/dateUtils';

export default function EntryTable({ logs, loading }) {
  const navigate = useNavigate();
  const scrollRef = useHorizontalScroll();
  const entryPath = (log) => log.formType === 'tool-handover' ? `/tool-handover/${log.id}` : `/form/${log.id}`;

  if (loading) {
    return (
      <div className="table-container p-12 text-center text-slate-500 dark:text-slate-400 text-sm">
        <div className="w-10 h-10 border-4 border-indigo-100 dark:border-indigo-950 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin mx-auto mb-3" />
        Loading production entries...
      </div>
    );
  }

  if (!logs.length) {
    return (
      <div className="table-container p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center mx-auto mb-3">
          <Wrench size={24} className="text-slate-400 dark:text-slate-500" />
        </div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No production entries found</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try adjusting your filters or upload a new form.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Mobile Card List (Visible on screens < 640px) */}
      <div className="block sm:hidden space-y-3">
        {logs.map((log) => {
          const dateStr = formatLogDate(log);
          const timeStr = formatLogTime(log);
          return (
            <div
              key={log.id}
              onClick={() => navigate(entryPath(log))}
              className="card p-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer active:scale-[0.99] touch-manipulation"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  #{log.id}
                </span>
                {log.formType === 'tool-handover' ? <span className="badge bg-violet-100 text-violet-700 border border-violet-200 dark:bg-violet-950/80 dark:text-violet-300 dark:border-violet-800">Handover</span> : <span className={`badge ${
                  log.shift === 'A' ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' :
                  log.shift === 'B' ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800' :
                  'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                }`}>
                  Shift {log.shift}
                </span>}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">Date &amp; Machine</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{dateStr} · {log.machineNo}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">Time Uploaded</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">{timeStr}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">Total Production</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{log.totalProduction} pcs</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">Total Loss</span>
                  <span className={`font-bold ${log.totalLossMin > 30 ? 'text-red-600 dark:text-red-400' : log.totalLossMin > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'}`}>
                    {log.totalLossMin > 0 ? `${log.totalLossMin} min` : '0 min'}
                  </span>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 truncate max-w-[180px]">By: {log.uploadedBy}</span>
                <span className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                  View Sheet <ChevronRight size={14} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View (Visible on screens >= 640px) */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 px-5 py-4 dark:border-slate-700/80 mb-4 bg-white/50 dark:bg-slate-900/50 rounded-xl border">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
              <ListFilter size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Production Logs</h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">Latest submitted shop-floor forms</p>
            </div>
          </div>
          <button onClick={() => window.location.reload()} className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-indigo-500/10" title="Refresh entries">
            <RefreshCw size={16} />
          </button>
        </div>
        <div className="flex items-start gap-4">
          <div ref={scrollRef} className="flex-1 overflow-x-auto table-container no-scrollbar">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/60">
                  <th className="table-header uppercase">Log ID</th>
                  <th className="table-header uppercase">Shift</th>
                  <th className="table-header uppercase">Machine No</th>
                  <th className="table-header uppercase">Employee ID</th>
                  <th className="table-header uppercase">QA Cell</th>
                  <th className="table-header uppercase">Part No</th>
                  <th className="table-header uppercase">
                    <span className="flex items-center gap-1">Total Prod. <ArrowUpDown size={12} /></span>
                  </th>
                  <th className="table-header uppercase">
                    <span className="flex items-center gap-1 text-red-500 dark:text-red-400">Loss (Min) <Clock size={12} /></span>
                  </th>
                  <th className="table-header uppercase">Uploaded By</th>
                  <th className="table-header text-center uppercase">Actions</th>
                </tr>
              </thead>
          <tbody>
            {logs.map((log, idx) => (
              <tr key={log.id} className="table-row h-[61px]" style={{ animationDelay: `${idx * 40}ms` }}>
                <td className="table-cell font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">#{log.id}</td>
                <td className="table-cell">
                  {log.formType === 'tool-handover' ? <span className="badge bg-violet-100 text-violet-700 border border-violet-200 dark:bg-violet-950/80 dark:text-violet-300 dark:border-violet-800">Handover</span> : <span className={`badge ${
                    log.shift === 'A' ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' :
                    log.shift === 'B' ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800' :
                    'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                  }`}>
                    Shift {log.shift}
                  </span>}
                </td>
                <td className="table-cell font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">{log.machineNo}</td>
                <td className="table-cell font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">{log.employeeId || '—'}</td>
                <td className="table-cell text-slate-600 dark:text-slate-300">{log.qaCell}</td>
                <td className="table-cell">
                  <div className="text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{log.partNo1}</span>
                    {log.partNo2 && (
                      <span className="text-slate-400 dark:text-slate-500 ml-1">/ {log.partNo2}</span>
                    )}
                  </div>
                </td>
                <td className="table-cell">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{log.totalProduction}</span>
                </td>
                <td className="table-cell">
                  <span className={`font-semibold ${log.totalLossMin > 30 ? 'text-red-600 dark:text-red-400' : log.totalLossMin > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'}`}>
                    {log.totalLossMin > 0 ? `${log.totalLossMin} min` : '—'}
                  </span>
                </td>
                <td className="table-cell text-slate-600 dark:text-slate-400 font-medium">{log.uploadedBy}</td>
                <td className="table-cell text-center">
                  <button
                    onClick={() => navigate(entryPath(log))}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
                               text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200/60 dark:border-indigo-800/60 transition-colors cursor-pointer"
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

      {/* Date/Time Right Panel */}
      <div className="w-[180px] shrink-0 border border-indigo-100 dark:border-indigo-800/60 bg-white/50 dark:bg-slate-900/40 rounded-xl overflow-hidden shadow-sm flex flex-col backdrop-blur-sm">
        <div className="bg-indigo-50/70 dark:bg-indigo-950/40 px-4 py-3.5 border-b border-indigo-100 dark:border-indigo-800/60 flex items-center gap-2 h-[46px]">
          <Calendar size={14} className="text-indigo-500" />
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Date / Time</span>
        </div>
        <div className="flex flex-col">
          {logs.map((log) => {
             const dateStr = formatLogDate(log);
             const timeStr = formatLogTime(log);
             
             return (
              <div key={`dt-${log.id}`} className="h-[61px] px-4 flex flex-col justify-center border-b border-slate-100 dark:border-slate-800/80 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  <Calendar size={12} className="text-indigo-400 shrink-0" />
                  <span className="truncate">{dateStr}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <Clock size={12} className="text-indigo-500 shrink-0" />
                  <span className="truncate">{timeStr}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
</div>
  );
}

