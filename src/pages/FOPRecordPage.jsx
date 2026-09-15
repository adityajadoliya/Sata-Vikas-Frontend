import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileClock, ArrowLeft, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getFilteredFormBList, getProductionLogs } from '../services/api';
import FilterBar from '../components/dashboard/FilterBar';
import EntryTable from '../components/dashboard/EntryTable';
import ToolHandoverUploadModal from '../components/upload/ToolHandoverUploadModal';

export default function FOPRecordPage() {
  const { user, isAdmin } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ dateFrom: '', dateTo: '', shift: '', machineNo: '', search: '' });
  const [showUploadModal, setShowUploadModal] = useState(false);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const apiFilters = { ...filters };
      if (!isAdmin && user) {
        apiFilters.operator_id = user.employeeId || user.id;
        apiFilters.userId = user.employeeId || user.id;
      }
      let data = await getFilteredFormBList(apiFilters);
      if (!data || data.length === 0) {
        const fallback = await getProductionLogs(apiFilters);
        const fopFallback = fallback.filter(l => l.formType === 'tool-handover');
        if (fopFallback.length > 0) data = fopFallback;
      }
      setLogs(data || []);
    } catch (error) {
      console.error('Failed to fetch FOP records:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, isAdmin, user?.id, user?.employeeId]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);
  useEffect(() => {
    window.addEventListener('production-log-submitted', fetchRecords);
    return () => window.removeEventListener('production-log-submitted', fetchRecords);
  }, [fetchRecords]);

  return (
    <div className="page-enter mx-auto max-w-7xl space-y-6">
      <div className="overview-banner min-h-[170px] p-6 text-slate-900 dark:text-white sm:p-8 flex flex-col justify-between">
        <div>
          <Link to="/dashboard" className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 transition-colors hover:text-violet-900 dark:text-violet-200 dark:hover:text-white">
            <ArrowLeft size={15} /> Dashboard Overview
          </Link>
          <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-600 text-white shadow-md">
                <FileClock size={22} />
              </span>
              <div>
                <h2 className="page-heading text-2xl font-bold sm:text-3xl">First Operation Part (FOP) Record (Page - B)</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-indigo-100/80">Dedicated FOP records, tool changes, and shift handover reports.</p>
              </div>
            </div>

            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-primary !bg-violet-600 hover:!bg-violet-700 text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Upload size={16} />
              Upload Page B Form
            </button>
          </div>
        </div>
      </div>

      <FilterBar filters={filters} setFilters={setFilters} />
      <EntryTable logs={logs} loading={loading} />

      {showUploadModal && (
        <ToolHandoverUploadModal
          onClose={() => setShowUploadModal(false)}
          onSubmitted={() => {
            setShowUploadModal(false);
            fetchRecords();
          }}
        />
      )}
    </div>
  );
}

