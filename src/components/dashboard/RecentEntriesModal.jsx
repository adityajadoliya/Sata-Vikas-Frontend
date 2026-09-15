import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductionLogs } from '../../services/api';
import { X, Clock, Calendar, Eye, ChevronRight, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { formatLogDate, formatLogTime, parseUtcDate } from '../../utils/dateUtils';

export default function RecentEntriesModal({ onClose }) {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecent() {
      try {
        setLoading(true);
        const data = await getProductionLogs();
        // Sort by uploadedAt / id descending to get the newest first
        const sorted = [...data].sort((a, b) => {
          const timeA = a.uploadedAt ? (parseUtcDate(a.uploadedAt)?.getTime() || 0) : a.id;
          const timeB = b.uploadedAt ? (parseUtcDate(b.uploadedAt)?.getTime() || 0) : b.id;
          return timeB - timeA;
        });
        setLogs(sorted.slice(0, 5)); // Show top 5 recent entries in small screen
      } catch (err) {
        console.error('Failed to load recent entries:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRecent();
  }, []);

  const handleView = (log) => {
    onClose();
    if (log.formType === 'tool-handover') {
      navigate(`/tool-handover/${log.id}`);
    } else {
      navigate(`/form/${log.id}`);
    }
  };

  const formatDate = (log) => formatLogDate(log);
  const formatTime = (log) => formatLogTime(log);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-r from-indigo-50/50 via-white to-violet-50/50 dark:from-slate-900 dark:to-indigo-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Clock size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Recent Form Entries
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
                  Live
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Latest submitted production and handover sheets</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-3">
          {loading ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs">
              <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-2" />
              Loading recent entries...
            </div>
          ) : logs.length === 0 ? (
            <div className="py-12 text-center">
              <FileText size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No recent entries found</p>
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                onClick={() => handleView(log)}
                className="group p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                      #{log.id}
                    </span>
                    {log.formType === 'tool-handover' ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                        Tool & Handover
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        Shift {log.shift} · {log.machineNo}
                      </span>
                    )}
                  </div>

                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {log.formType === 'tool-handover' ? 'Handover & Tool Status Form' : `${log.partNo1} ${log.partNo2 ? '/ ' + log.partNo2 : ''}`}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} className="text-indigo-400" />
                      {formatDate(log)}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                      <Clock size={11} className="text-indigo-400" />
                      {formatTime(log)}
                    </span>
                    <span className="truncate text-slate-400 dark:text-slate-500">By {log.uploadedBy || 'Employee'}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(log);
                  }}
                  className="shrink-0 p-2 rounded-xl bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all cursor-pointer"
                  title="View sheet details"
                >
                  <Eye size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <p className="text-[11px] text-slate-400 dark:text-slate-500">Showing 5 most recent submissions</p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
