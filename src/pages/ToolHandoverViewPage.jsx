import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Edit2, Printer, Save, Image } from 'lucide-react';
import { getFormBById, updateFormB } from '../services/api';
import ToolHandoverSheet from '../components/upload/ToolHandoverSheet';

const cloneForm = (form) => JSON.parse(JSON.stringify(form));

export default function ToolHandoverViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [savedData, setSavedData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    getFormBById(id)
      .then((form) => {
        if (form) {
          setData(cloneForm(form));
          setSavedData(cloneForm(form));
        } else {
          return getProductionLogById(id);
        }
      })
      .then((form) => {
        if (form && !data) {
          setData(cloneForm(form));
          setSavedData(cloneForm(form));
        }
      })
      .catch(() => setData(false));
  }, [id]);

  if (data === null) return <div className="flex min-h-[60vh] items-center justify-center text-sm text-slate-500">Loading form…</div>;
  if (!data) return <div className="card mx-auto max-w-md p-8 text-center"><p className="font-semibold text-red-600">Form not found</p><button onClick={() => navigate('/fop-record')} className="btn-primary mt-4">Back to FOP Records</button></div>;

  const updateRecord = (index, field, value) => setData(current => {
    const existing = current.records || [];
    const records = Array.from({ length: Math.max(16, existing.length) }, (_, recordIndex) => ({ ...(existing[recordIndex] || {}), ...(recordIndex === index ? { [field]: value } : {}) }));
    return { ...current, records };
  });
  const updateDetail = (field, value) => setData(current => ({ ...current, details: { ...current.details, [field]: value } }));
  const save = async () => {
    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);
    try {
      const updated = await updateFormB(id, data);
      setData(cloneForm(updated));
      setSavedData(cloneForm(updated));
      setEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setSaveError(error.message || 'Unable to save your changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  const cancelEdit = () => {
    setData(cloneForm(savedData));
    setEditing(false);
    setSaveError('');
  };

  return (
    <div className="page-enter mx-auto max-w-7xl space-y-4">
      <div className="card flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
        <div className="flex items-center gap-3"><button onClick={() => navigate('/fop-record')} className="btn-ghost !px-2.5" title="Back to FOP records"><ArrowLeft size={20} /></button><div><h2 className="page-heading text-lg font-bold text-slate-900 dark:text-slate-100">First Operation Part (FOP) Record #{id}</h2><p className="text-xs text-slate-500 dark:text-slate-400">{data.date} · Submitted by {data.uploadedBy}</p></div></div>
        <div className="flex gap-2">
          <button onClick={editing ? cancelEdit : () => { setSaveError(''); setSaveSuccess(false); setEditing(true); }} className={`btn-secondary text-xs ${editing ? 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-300' : ''}`}><Edit2 size={15} /> {editing ? 'Cancel' : 'Edit Form'}</button>
          {editing && <button onClick={save} disabled={saving} className="btn-success text-xs"><Save size={15} /> {saving ? 'Saving…' : 'Save Changes'}</button>}
          <button onClick={() => window.print()} className="btn-secondary text-xs"><Printer size={15} /> Print</button><button className="btn-secondary text-xs"><Download size={15} /> Export</button>
          {(data.imagePath || data.image_path) && <a href={data.imagePath || data.image_path} target="_blank" rel="noreferrer" className="btn-secondary text-xs"><Image size={15} /> Original Photo</a>}
        </div>
      </div>
      {editing && <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">Form Edit Mode Active: update the cells, then select <strong>Save Changes</strong>.</div>}
      {saveSuccess && <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">Changes saved successfully.</div>}
      {saveError && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">{saveError}</div>}
      <div className="card overflow-hidden"><ToolHandoverSheet records={data.records || []} details={data.details || {}} onRecordChange={updateRecord} onDetailsChange={updateDetail} onSubmit={save} readOnly={!editing} /></div>
    </div>
  );
}
