import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getProductionLogs } from '../services/api';
import FilterBar from '../components/dashboard/FilterBar';
import EntryTable from '../components/dashboard/EntryTable';
import { ClipboardList, FileClock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateFrom: '', dateTo: '', shift: '', machineNo: '', search: '',
  });

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const apiFilters = { ...filters };
      if (!isAdmin && user) apiFilters.userId = user.employeeId || user.id;
      const data = await getProductionLogs(apiFilters);
      // Keep Page B records exclusive to the dedicated FOP page.
      setLogs(data.filter(log => log.formType !== 'tool-handover'));
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, isAdmin, user?.id, user?.employeeId]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  useEffect(() => {
    window.addEventListener('production-log-submitted', fetchLogs);
    return () => window.removeEventListener('production-log-submitted', fetchLogs);
  }, [fetchLogs]);

  return (
    <div className="page-enter max-w-7xl mx-auto space-y-6">
      <section aria-label="Production record pages" className="grid gap-3 sm:grid-cols-2">
        <Link to="/hourly-production-monitoring" className="group flex min-h-20 items-center justify-between gap-3 rounded-2xl border border-indigo-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-md dark:border-indigo-800 dark:bg-slate-900 dark:hover:border-indigo-500">
          <span className="flex min-w-0 items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm"><ClipboardList size={19} /></span><span className="min-w-0"><span className="block text-sm font-bold text-slate-900 dark:text-white">Hourly Production Monitoring Book (Page - A)</span><span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">View hourly production records</span></span></span><ArrowRight size={18} className="shrink-0 text-indigo-600 transition-transform group-hover:translate-x-1 dark:text-indigo-300" />
        </Link>
        <Link to="/fop-record" className="group flex min-h-20 items-center justify-between gap-3 rounded-2xl border border-violet-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-violet-400 hover:shadow-md dark:border-violet-800 dark:bg-slate-900 dark:hover:border-violet-500">
          <span className="flex min-w-0 items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-600 text-white shadow-sm"><FileClock size={19} /></span><span className="min-w-0"><span className="block text-sm font-bold text-slate-900 dark:text-white">First Operation Part (FOP) Record (Page - B)</span><span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">Open dedicated FOP records</span></span></span><ArrowRight size={18} className="shrink-0 text-violet-600 transition-transform group-hover:translate-x-1 dark:text-violet-300" />
        </Link>
      </section>

      <section aria-labelledby="hourly-production-overview" className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2 px-1"><div><h2 id="hourly-production-overview" className="text-base font-bold text-slate-900 dark:text-white">Hourly Production Monitoring Book</h2><p className="text-xs text-slate-500 dark:text-slate-400">Page A records shown on the Dashboard Overview</p></div><Link to="/hourly-production-monitoring" className="text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-100">Open dedicated Page A →</Link></div>

        <FilterBar filters={filters} setFilters={setFilters} />
        <EntryTable logs={logs} loading={loading} />
      </section>

    </div>
  );
}
