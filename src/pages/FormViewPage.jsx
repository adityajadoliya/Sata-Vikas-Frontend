import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getProductionLogById, updateProductionLog } from '../services/api';
import FormViewer from '../components/form-viewer/FormViewer';
import { ArrowLeft, Printer, Download, Edit2, Save, CheckCircle, Clock, Image } from 'lucide-react';
import { parseUtcDate } from '../utils/dateUtils';

const cloneForm = (form) => JSON.parse(JSON.stringify(form));

export default function FormViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [savedData, setSavedData] = useState(null);
  const [draftData, setDraftData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const log = await getProductionLogById(id);
        const record = cloneForm(log);
        setSavedData(record);
        setDraftData(cloneForm(record));
      } catch (err) {
        setError(err.message || 'Failed to load form data');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const data = isEditing ? draftData : savedData;
  const canEdit = isAdmin || String(savedData?.uploadedById) === String(user?.id);

  const startEditing = () => {
    setError('');
    setSaveSuccess(false);
    setDraftData(cloneForm(savedData));
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraftData(cloneForm(savedData));
    setError('');
    setIsEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const updated = await updateProductionLog(id, draftData);
      const record = cloneForm(updated);
      setSavedData(record);
      setDraftData(cloneForm(record));
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Unable to save your changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatUploadTime = (isoString) => {
    if (!isoString) return '';
    try {
      const d = parseUtcDate(isoString);
      if (!d || isNaN(d.getTime())) return '';
      return new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(d);
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-indigo-100 dark:border-indigo-950 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Loading form data...</p>
        </div>
      </div>
    );
  }

  if (error && !savedData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="card p-8 text-center max-w-md">
          <p className="text-red-600 dark:text-red-400 font-bold mb-2">Error</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">{error}</p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary mt-4 cursor-pointer">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter max-w-7xl mx-auto space-y-4">
      {/* Header bar */}
      <div className="card flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 mb-2">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="btn-ghost !px-2.5 cursor-pointer" title="Back">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="page-heading text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">Production Sheet #{id}</h2>
              {saveSuccess && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200 dark:border-emerald-800 animate-fade-in">
                  <CheckCircle size={13} /> Saved Successfully
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-1.5">
              <span>{data?.date}</span>
              <span>·</span>
              <span>Shift {data?.shift}</span>
              <span>·</span>
              <span>Machine <strong className="text-indigo-600 dark:text-indigo-400 font-mono">{data?.machineNo}</strong></span>
              {data?.uploadedAt && (
                <>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-200">
                    <Clock size={11} className="text-slate-400" />
                    {formatUploadTime(data.uploadedAt)}
                  </span>
                </>
              )}
              <span>·</span>
              <span>Uploaded by <strong className="text-slate-700 dark:text-slate-200">{data?.uploadedBy}</strong></span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canEdit && (
            <button
              onClick={isEditing ? cancelEditing : startEditing}
              className={`btn-secondary text-xs cursor-pointer ${isEditing ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700' : ''}`}
            >
              <Edit2 size={15} />
              {isEditing ? 'Cancel' : 'Edit Form'}
            </button>
          )}

          {isEditing && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-success text-xs cursor-pointer flex items-center gap-1.5"
            >
              <Save size={15} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          )}

          <button onClick={() => window.print()} className="btn-secondary text-xs cursor-pointer">
            <Printer size={15} />
            <span className="hidden sm:inline">Print</span>
          </button>
          <button className="btn-secondary text-xs cursor-pointer">
            <Download size={15} />
            <span className="hidden sm:inline">Export</span>
          </button>
          {data?.imagePath && (
            <a href={data.imagePath} target="_blank" rel="noreferrer" className="btn-secondary text-xs cursor-pointer">
              <Image size={15} />
              <span className="hidden sm:inline">Original Photo</span>
            </a>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2.5 animate-fade-in">
          <Edit2 size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            <strong>Form Edit Mode Active:</strong> You can edit grid cells or header fields. Click <strong>"Save Changes"</strong> to apply updates.
          </span>
        </div>
      )}

      {error && savedData && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-3.5 py-3 text-xs font-medium text-red-800 dark:border-red-800/60 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Form Viewer Component */}
      <div className="card p-4 lg:p-6 overflow-hidden">
        <FormViewer data={data} editable={isEditing} onChange={setDraftData} />
      </div>
    </div>
  );
}

