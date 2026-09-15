import { useMemo, useState } from 'react';
import { Clock3, FileUp, History, UserRound } from 'lucide-react';
import { parseUtcDate } from '../../utils/dateUtils';

const formatTimestamp = (value) => {
  const d = parseUtcDate(value);
  if (!d) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(d);
};

export default function EmployeeFormUploadActivity({ activities, loading }) {
  const [showAll, setShowAll] = useState(false);
  const visibleActivities = useMemo(() => showAll ? activities : activities.slice(0, 6), [activities, showAll]);

  return (
    <section className="table-container flex min-h-[390px] flex-col overflow-hidden" aria-label="Employee Form Upload Activity">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 px-5 py-4 dark:border-slate-700/80">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300"><FileUp size={18} /></div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Employee Form Upload Activity</h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">Latest employee form submissions</p>
          </div>
        </div>
        <span className="badge bg-violet-100 text-violet-700 dark:bg-violet-950/80 dark:text-violet-300">{activities.length}</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {loading ? (
          <div className="grid h-full min-h-[220px] place-items-center text-xs text-slate-500">Loading activity…</div>
        ) : !activities.length ? (
          <div className="grid h-full min-h-[220px] place-items-center px-6 text-center">
            <div><History size={26} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" /><p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No uploads yet</p><p className="mt-1 text-xs text-slate-400">New form submissions will appear here.</p></div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {visibleActivities.map(activity => (
              <article key={activity.id} className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-700/70 dark:bg-slate-800/45">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white text-violet-600 shadow-sm dark:bg-slate-800 dark:text-violet-300"><UserRound size={14} /></span><div className="min-w-0"><p className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">{activity.employeeName}</p><p className="font-mono text-[10px] text-slate-500 dark:text-slate-400">{activity.employeeId}</p></div></div>
                  <span className="shrink-0 rounded-md bg-white px-1.5 py-0.5 font-mono text-[10px] font-semibold text-indigo-600 ring-1 ring-indigo-100 dark:bg-slate-800 dark:text-indigo-300 dark:ring-indigo-800">#{activity.logId}</span>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 border-t border-slate-200/70 pt-2 text-[10px] dark:border-slate-700"><span className="font-medium text-slate-600 dark:text-slate-300">{activity.formName}</span><span className="flex items-center gap-1 whitespace-nowrap text-slate-400 dark:text-slate-500"><Clock3 size={11} /> {formatTimestamp(activity.uploadedAt)}</span></div>
              </article>
            ))}
          </div>
        )}
      </div>
      {activities.length > 6 && <div className="border-t border-slate-200/80 p-3 text-center dark:border-slate-700/80"><button type="button" onClick={() => setShowAll(current => !current)} className="text-xs font-semibold text-violet-600 transition hover:text-violet-500 dark:text-violet-300">{showAll ? 'Show Recent' : `View All (${activities.length})`}</button></div>}
    </section>
  );
}
