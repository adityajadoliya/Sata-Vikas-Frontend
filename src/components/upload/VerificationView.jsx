import { useState } from 'react';
import ImagePreview from './ImagePreview';
import FormViewer from '../form-viewer/FormViewer';
import { Camera, FileEdit, CheckCircle2, RotateCcw, Columns2, FileText, Maximize2, Sparkles, Image as ImageIcon } from 'lucide-react';

export default function VerificationView({ imageUrl, formData, onChange, onReupload, onSubmit, submitting, extracting, errorMessage }) {
  const [mobileTab, setMobileTab] = useState('form'); // 'photo' | 'form'
  const [viewMode, setViewMode] = useState('form'); // 'form' (default full width) | 'compare' (split side-by-side) | 'photo'

  return (
    <div className="flex flex-col h-full">
      {/* Top Controls & Instruction Banner */}
      <div className="bg-gradient-to-r from-indigo-50/90 via-slate-50 to-amber-50/70 dark:from-indigo-950/40 dark:via-slate-900/60 dark:to-amber-950/30 border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <p className="text-xs text-slate-700 dark:text-slate-200 font-medium">
            {viewMode === 'form' && (
              <>
                <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">Form View Active:</strong> Review &amp; edit extracted entries below. Click <strong>Compare with Photo</strong> to verify side-by-side.
              </>
            )}
            {viewMode === 'compare' && (
              <>
                <strong className="text-amber-600 dark:text-amber-400 font-semibold">Side-by-Side Comparison:</strong> Compare uploaded form photo on left with editable fields on right.
              </>
            )}
            {viewMode === 'photo' && (
              <>
                <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">Photo View:</strong> Inspect original uploaded paper form sheet.
              </>
            )}
          </p>
        </div>

        {/* View Mode Switcher (Desktop) */}
        {imageUrl && (
          <div className="hidden sm:flex items-center bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm gap-1">
            <button
              type="button"
              onClick={() => setViewMode('form')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'form'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
              }`}
              title="View full editable form without split screen"
            >
              <FileText size={13} />
              Form View
            </button>

            <button
              type="button"
              onClick={() => setViewMode('compare')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'compare'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
              }`}
              title="Compare original form image side-by-side with editable fields"
            >
              <Columns2 size={13} />
              Compare with Photo
            </button>

            <button
              type="button"
              onClick={() => setViewMode('photo')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'photo'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
              }`}
              title="View original image in full size"
            >
              <ImageIcon size={13} />
              Photo Only
            </button>
          </div>
        )}
      </div>

      {formData?.lowConfidenceFields?.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/60 px-4 py-2 text-[11px] text-amber-800 dark:text-amber-200">
          Some values were difficult to read: <strong>{formData.lowConfidenceFields.join(', ')}</strong>. Please check and correct them before saving.
        </div>
      )}
      {errorMessage && (
        <div role="alert" className="border-b border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
          {errorMessage}
        </div>
      )}
      {extracting && (
        <div className="border-b border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-800 dark:border-indigo-950 dark:bg-indigo-950/40 dark:text-indigo-200">
          Reading the form image…
        </div>
      )}

      {/* Mobile Tab Toggle (Visible on screens < 640px) */}
      {imageUrl && (
        <div className="flex sm:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shrink-0 gap-2">
          <button
            onClick={() => setMobileTab('form')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mobileTab === 'form' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <FileEdit size={14} /> Edit Form Entries
          </button>
          <button
            onClick={() => setMobileTab('photo')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mobileTab === 'photo' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Camera size={14} /> View Form Photo
          </button>
        </div>
      )}

      {/* ── MAIN CONTENT AREA ────────────────────────────────── */}
      <div className="flex-1 overflow-hidden min-h-[400px] flex flex-col">

        {/* ── 1. DEFAULT: FORM VIEW ONLY (Full Width) ──────── */}
        {viewMode === 'form' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <FileEdit size={14} className="text-indigo-600 dark:text-indigo-400" /> Extracted Page A Data (Editable)
                </h4>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 font-semibold">
                  Live Editing Enabled
                </span>
              </div>

              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setViewMode('compare')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200/80 dark:border-indigo-800/80 shadow-sm transition-all cursor-pointer hover:scale-[1.02]"
                >
                  <Columns2 size={13} />
                  <span>Compare with Photo</span>
                </button>
              )}
            </div>

            <div className="flex-1 overflow-auto no-scrollbar p-3 sm:p-5">
              <FormViewer data={formData} editable={true} onChange={onChange} />
            </div>
          </div>
        )}

        {/* ── 2. COMPARE MODE: SIDE-BY-SIDE SPLIT ─────────────── */}
        {viewMode === 'compare' && (
          <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-0 overflow-hidden">
            {/* Left: Photo Preview */}
            <div className={`border-r border-slate-200 dark:border-slate-800 flex-col overflow-hidden ${
              mobileTab === 'photo' ? 'flex' : 'hidden xl:flex'
            }`}>
              <div className="bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Camera size={14} className="text-indigo-600 dark:text-indigo-400" /> Uploaded Form Image
                </h4>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">Top-anchored · Scroll &amp; drag to explore</span>
              </div>
              <div className="flex-1 overflow-hidden flex flex-col p-1">
                <ImagePreview imageUrl={imageUrl} />
              </div>
            </div>

            {/* Right: Editable Form */}
            <div className={`flex-col overflow-hidden ${
              mobileTab === 'form' ? 'flex' : 'hidden xl:flex'
            }`}>
              <div className="bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileEdit size={14} className="text-indigo-600 dark:text-indigo-400" /> Extracted Form Data (Editable)
                </h4>
                <button
                  type="button"
                  onClick={() => setViewMode('form')}
                  className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-300 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Maximize2 size={12} /> Full Form View
                </button>
              </div>
              <div className="flex-1 overflow-auto no-scrollbar p-2 sm:p-3">
                <FormViewer data={formData} editable={true} onChange={onChange} />
              </div>
            </div>
          </div>
        )}

        {/* ── 3. PHOTO ONLY MODE ─────────────────────────────── */}
        {viewMode === 'photo' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-800/80 px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Camera size={14} className="text-indigo-600 dark:text-indigo-400" /> Full Size Uploaded Image
              </h4>
              <button
                type="button"
                onClick={() => setViewMode('form')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 px-3 py-1 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <FileText size={13} /> Back to Form View
              </button>
            </div>
            <div className="flex-1 overflow-hidden p-2 flex flex-col">
              <ImagePreview imageUrl={imageUrl} />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between shadow-lg shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onReupload}
            className="btn-secondary text-xs flex items-center gap-1.5 cursor-pointer"
            disabled={submitting || extracting}
          >
            <RotateCcw size={14} /> Re-upload
          </button>
          {imageUrl && viewMode === 'form' && (
            <button
              type="button"
              onClick={() => setViewMode('compare')}
              className="btn-secondary text-xs hidden sm:flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 cursor-pointer"
            >
              <Columns2 size={13} /> Compare with Photo
            </button>
          )}
        </div>

        <button
          onClick={onSubmit}
          disabled={submitting || extracting}
          className="btn-success text-xs flex items-center gap-1.5 px-5 cursor-pointer"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle2 size={16} />
              Confirm &amp; Submit to DB
            </>
          )}
        </button>
      </div>
    </div>
  );
}
