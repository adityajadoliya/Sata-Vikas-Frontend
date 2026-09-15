import { useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { extractFormBDataFromImage, saveFormB } from '../../services/api';
import {
  ClipboardPenLine,
  Image as ImageIcon,
  X,
  CheckCircle2,
  RotateCcw,
  Camera,
  FileUp,
  FileEdit,
  Loader2,
  Sparkles,
  ScanLine,
  AlertCircle,
  HelpCircle,
  Check,
  Columns2,
  Maximize2,
  FileText
} from 'lucide-react';
import ToolHandoverSheet from './ToolHandoverSheet';
import ImagePreview from './ImagePreview';
import CameraCapture from './CameraCapture';
import { fillBlankValues, prepareFormImage } from './prepareFormImage';

const blankRecord = () => ({
  toolDescription: '',
  operationNo: '',
  machineNo: '',
  toolNo: '',
  time: '',
  reasonForFOP: '',
  fopParts: '',
  fopRejection: '',
  toolSetBy: '',
  qaInsp: '',
  quantity: '',
  totFopPart: '',
  handoverCheck: '',
  defect: '',
  remarks: '',
  materialOrTool: '',
});

export default function ToolHandoverUploadModal({ onClose, onSubmitted }) {
  const { user } = useAuth();
  const inputRef = useRef(null);
  const nativeCameraRef = useRef(null);
  const [step, setStep] = useState('upload'); // 'upload' | 'camera' | 'review'
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extractionDone, setExtractionDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [lowConfidenceFields, setLowConfidenceFields] = useState([]);
  const [mobileTab, setMobileTab] = useState('form'); // 'photo' | 'form'
  const [viewMode, setViewMode] = useState('form'); // 'form' (default full width) | 'compare' (split side-by-side) | 'photo'

  const [records, setRecords] = useState(Array.from({ length: 16 }, blankRecord));
  const [details, setDetails] = useState({
    problemAnalysis: '',
    why1: '',
    why2: '',
    why3: '',
    why4: '',
    why5: '',
    rootCause: '',
    action1: '',
    action2: '',
    shiftCommunication: '',
    supplierInfo: '',
    dieCavityNo: '',
    pdiOkPart1: '',
    pdiOkPart2: '',
    reworkGenPart1: '',
    reworkGenPart2: '',
    reworkClearedPart1: '',
    reworkClearedPart2: '',
    reworkApprovalNo: '',
    docNo: 'SV/F/0615',
    revNo: '03',
    dateRev: '17.04.2026',
    dateOrg: '01.04.2011',
    preparedByEmpNo: '',
    moduleIncharge: '',
    totalDefect: '',
    opnDefects: [
      { opn: '10', mr: '', cr: '' },
      { opn: '20', mr: '', cr: '' },
      { opn: '30', mr: '', cr: '' },
      { opn: '40', mr: '', cr: '' },
      { opn: '50', mr: '', cr: '' },
      { opn: '60', mr: '', cr: '' },
      { opn: '70', mr: '', cr: '' },
      { opn: '80', mr: '', cr: '' },
      { opn: '90', mr: '', cr: '' },
    ],
    opnDefectsTotalMr: '',
    opnDefectsTotalCr: '',
    materialAbnormalities: [
      { op: 'Op#10', abnormality1: '', abnormality2: '', abnormality3: '', abnormality4: '', totFopPart: '', total: '' },
      { op: 'Op#20', abnormality1: '', abnormality2: '', abnormality3: '', abnormality4: '', totFopPart: '', total: '' },
      { op: 'Op#30', abnormality1: '', abnormality2: '', abnormality3: '', abnormality4: '', totFopPart: '', total: '' },
      { op: 'Op#40', abnormality1: '', abnormality2: '', abnormality3: '', abnormality4: '', totFopPart: '', total: '' },
      { op: 'Op#50', abnormality1: '', abnormality2: '', abnormality3: '', abnormality4: '', totFopPart: '', total: '' },
      { op: 'Op#60', abnormality1: '', abnormality2: '', abnormality3: '', abnormality4: '', totFopPart: '', total: '' },
      { op: 'Op#70', abnormality1: '', abnormality2: '', abnormality3: '', abnormality4: '', totFopPart: '', total: '' },
    ],
  });

  const runExtraction = async (fileToExtract) => {
    const file = fileToExtract || selectedFile;
    if (!file) {
      setError('Please upload an image first to extract form data.');
      return;
    }

    setExtracting(true);
    setError('');
    try {
      const result = await extractFormBDataFromImage(file);
      console.info('[Form B OCR] raw extracted result:', result);

      if (result) {
        setImagePath(result.imagePath || null);

        // ── 1. Populate grid records (16 rows) ───────────────────────────
        if (Array.isArray(result.records) && result.records.length > 0) {
          const filledRecords = Array.from({ length: 16 }, (_, idx) => {
            const r = result.records[idx] || {};
            return {
              toolDescription: r.toolDescription || r.tool_name || '',
              operationNo: r.operationNo || '',
              machineNo: r.machineNo || '',
              toolNo: r.toolNo || r.tool_code || '',
              time: r.time || '',
              reasonForFOP: r.reasonForFOP || r.remarks || '',
              fopParts: r.fopParts || '',
              fopRejection: r.fopRejection || '',
              toolSetBy: r.toolSetBy || '',
              qaInsp: r.qaInsp || '',
              quantity: r.quantity || '',
              totFopPart: r.totFopPart || '',
              handoverCheck: r.handoverCheck || '',
              defect: r.defect || '',
              remarks: r.remarks || '',
              materialOrTool: r.materialOrTool || '',
            };
          });
          setRecords(current => fillBlankValues(current, filledRecords));
        } else if (Array.isArray(result.tool_records) && result.tool_records.length > 0) {
          const filledRecords = Array.from({ length: 16 }, (_, idx) => {
            const r = result.tool_records[idx] || {};
            return {
              toolDescription: r.tool_name || r.toolDescription || '',
              operationNo: r.operationNo || '',
              machineNo: r.machineNo || '',
              toolNo: r.tool_code || r.toolNo || '',
              time: r.time || '',
              reasonForFOP: r.reasonForFOP || r.remarks || '',
              fopParts: r.fopParts || '',
              fopRejection: r.fopRejection || '',
              toolSetBy: r.toolSetBy || '',
              qaInsp: r.qaInsp || '',
              quantity: '',
              totFopPart: '',
              handoverCheck: '',
              defect: '',
              remarks: r.remarks || '',
              materialOrTool: '',
            };
          });
          setRecords(current => fillBlankValues(current, filledRecords));
        }

        // ── 2. Populate all detail & header fields ────────────────────────
        const det = result.details || {};
        const hdr = result.header || {};

        // Normalize opnDefects to exactly 9 entries (rows 10-90, safe merge by opn key)
        const BASE_OPN = ['10', '20', '30', '40', '50', '60', '70', '80', '90'];
        const rawOpnDefects = det.opnDefects || result.opnDefects || null;
        let normalizedOpnDefects = null;
        if (Array.isArray(rawOpnDefects) && rawOpnDefects.length > 0) {
          const opnMap = Object.fromEntries(rawOpnDefects.map(d => [String(d.opn), d]));
          normalizedOpnDefects = BASE_OPN.map(opn => ({
            opn,
            mr: opnMap[opn]?.mr ?? '',
            cr: opnMap[opn]?.cr ?? '',
          }));
        }

        // Normalize materialAbnormalities to exactly 7 entries (safe merge by op key)
        const BASE_MA = ['Op#10', 'Op#20', 'Op#30', 'Op#40', 'Op#50', 'Op#60', 'Op#70'];
        const rawMa = det.materialAbnormalities || result.materialAbnormalities || null;
        let normalizedMa = null;
        if (Array.isArray(rawMa) && rawMa.length > 0) {
          const maMap = Object.fromEntries(rawMa.map(d => [d.op, d]));
          normalizedMa = BASE_MA.map(op => ({
            op,
            abnormality1: maMap[op]?.abnormality1 ?? '',
            abnormality2: maMap[op]?.abnormality2 ?? '',
            abnormality3: maMap[op]?.abnormality3 ?? '',
            abnormality4: maMap[op]?.abnormality4 ?? '',
            totFopPart: maMap[op]?.totFopPart ?? maMap[op]?.total ?? '',
            total: maMap[op]?.total ?? maMap[op]?.totFopPart ?? '',
          }));
        }

        setDetails(prev => {
          const extractedDetails = {
            // Spread all flat detail fields (problemAnalysis, why1-5, rootCause, action1/2,
            // startCheck0-3, endCheck0-3, totalDefect, defect1-6, quantity1-6,
            // pdiOkPart1/2, reworkGenPart1/2, reworkClearedPart1/2, reworkApprovalNo,
            // supplierInfo, dieCavityNo, preparedByEmpNo, moduleIncharge, etc.)
            ...det,
            // Header fields (only override if present)
            ...(hdr.log_date ? { log_date: hdr.log_date } : {}),
            ...(hdr.shift ? { shift: hdr.shift } : {}),
            ...(hdr.machine_no ? { machine_no: hdr.machine_no } : {}),
            ...(hdr.part_name ? { part_name: hdr.part_name } : {}),
            ...(hdr.operation_no ? { operation_no: hdr.operation_no } : {}),
            ...(hdr.operator_name ? { operator_name: hdr.operator_name } : {}),
            ...(hdr.supervisor_name ? { supervisor_name: hdr.supervisor_name } : {}),
            ...(hdr.handover_notes ? { handover_notes: hdr.handover_notes } : {}),
            // Fallback: populate signature fields from header if not already in details
            ...(!det.preparedByEmpNo && hdr.operator_name ? { preparedByEmpNo: hdr.operator_name } : {}),
            ...(!det.moduleIncharge && hdr.supervisor_name ? { moduleIncharge: hdr.supervisor_name } : {}),
          };
          const next = fillBlankValues(prev, extractedDetails);
          // Apply normalized arrays only when the AI extracted actual values
          if (normalizedOpnDefects) next.opnDefects = fillBlankValues(next.opnDefects, normalizedOpnDefects);
          if (normalizedMa) next.materialAbnormalities = fillBlankValues(next.materialAbnormalities, normalizedMa);
          console.info('[Form B OCR] populated details state:', next);
          return next;
        });

        if (Array.isArray(result.low_confidence_fields)) {
          setLowConfidenceFields(result.low_confidence_fields);
        }

        setExtractionDone(true);
      }
    } catch (err) {
      console.warn('Extraction encountered an issue:', err);
      setError(err.message || 'We could not read values from this form. You can try again or fill the fields manually.');
    } finally {
      setExtracting(false);
    }
  };

  const handleFile = async (file) => {
    if (!file) return;
    try {
      const optimizedFile = await prepareFormImage(file);
      setSelectedFile(optimizedFile);
      const url = URL.createObjectURL(optimizedFile);
      setImageUrl(url);
      setStep('review');
      // Automatically trigger extraction on upload for seamless workflow
      runExtraction(optimizedFile);
    } catch (e) {
      console.warn('Error previewing file, proceeding to manual entry:', e);
      setStep('review');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const updateRecord = (index, field, value) => {
    setRecords(current => current.map((record, recordIndex) => recordIndex === index ? { ...record, [field]: value } : record));
  };

  const updateDetails = (field, value) => setDetails(current => ({ ...current, [field]: value }));

  const handleReupload = () => {
    setStep('upload');
    setSelectedFile(null);
    setImageUrl(null);
    setImagePath(null);
    setError('');
    setExtractionDone(false);
    setLowConfidenceFields([]);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const firstMachine = records.find(record => record.machineNo)?.machineNo || details.machine_no || '—';
      const payload = {
        records,
        details,
        date: details.log_date || new Date().toISOString().split('T')[0],
        shift: details.shift || 'A',
        machineNo: firstMachine,
        partNo1: details.part_name || 'K-10',
        operationNumber: details.operation_no || '60',
        uploadedBy: user?.fullName || user?.username || 'Operator',
        uploadedById: String(user?.employeeId || user?.id || ''),
        employeeId: user?.employeeId || (user?.id ? `EMP-${String(user.id).padStart(4, '0')}` : 'EMP-0001'),
        supervisorName: details.supervisor_name || '',
        imagePath,
        uploadedAt: new Date().toISOString(),
      };

      console.info('[Form B comparison] values at Save click', payload);

      const saved = await saveFormB(payload);
      window.dispatchEvent(new Event('production-log-submitted'));
      onSubmitted?.(saved);
    } catch (err) {
      console.error('Submit failed:', err);
      setError(err.message || 'Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Hidden Native Camera Input */}
      <input
        ref={nativeCameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {step === 'camera' ? (
        <CameraCapture
          onCapture={(file) => {
            handleFile(file);
          }}
          onClose={() => setStep('upload')}
          onSwitchToFile={() => {
            setStep('upload');
            setTimeout(() => inputRef.current?.click(), 100);
          }}
        />
      ) : (
        <div className="modal-overlay" onClick={(event) => event.target === event.currentTarget && !submitting && !extracting && onClose()}>
          <div className={`modal-content flex flex-col overflow-hidden ${step === 'review' ? 'w-[96vw] h-[93vh] max-w-full' : 'w-full max-w-2xl'}`}>
            
            {/* Modal Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-3.5 dark:border-slate-800 sm:px-6 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2.5">
                <ClipboardPenLine size={20} className="text-violet-600 dark:text-violet-400" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    First Operation Part (FOP) Record (Page - B)
                    {step === 'review' && extractionDone && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <Check size={11} /> AI Form Data Extracted
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Scan &amp; extract handwritten tool handover records, verify values, and save.</p>
                </div>
              </div>
              {!submitting && !extracting && (
                <button onClick={onClose} className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer" aria-label="Close">
                  <X size={18} />
                </button>
              )}
            </div>

            {/* ── Step 1: Upload (Camera / File) ──────────────────── */}
            {step === 'upload' ? (
              <div className="p-6 space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0 text-rose-600" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Option 1: Take Photo / Open Camera */}
                  <div
                    className="group relative flex flex-col items-center justify-between p-6 sm:p-7 rounded-2xl border-2 border-violet-200 dark:border-violet-900/60 bg-gradient-to-b from-violet-50/70 to-violet-100/30 dark:from-violet-950/40 dark:to-violet-900/20 hover:border-violet-500 dark:hover:border-violet-400 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-200 text-center"
                  >
                    <div
                      onClick={() => setStep('camera')}
                      className="flex flex-col items-center w-full cursor-pointer"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-violet-600 text-white flex items-center justify-center mb-3 shadow-lg shadow-violet-600/30 group-hover:scale-105 transition-transform">
                        <Camera size={30} />
                      </div>
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300 text-[10px] font-bold mb-2 uppercase tracking-wide">
                        <Sparkles size={11} /> AI OCR Ready
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                        Take Photo / Camera
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                        Open device camera to photograph the Page B form sheet
                      </p>
                    </div>

                    <div className="w-full space-y-2">
                      <button
                        type="button"
                        onClick={() => setStep('camera')}
                        className="w-full py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-md shadow-violet-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <Camera size={15} /> Open Live Camera
                      </button>
                      <button
                        type="button"
                        onClick={() => nativeCameraRef.current?.click()}
                        className="w-full py-2 px-3 rounded-xl bg-violet-100/80 hover:bg-violet-200/90 dark:bg-violet-950/80 dark:hover:bg-violet-900 text-violet-800 dark:text-violet-200 text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles size={13} /> Snap with Mobile Camera
                      </button>
                    </div>
                  </div>

                  {/* Option 2: Upload File */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={`group relative flex flex-col items-center justify-between p-6 sm:p-7 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer text-center ${
                      dragActive
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/40'
                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex flex-col items-center w-full">
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-3 shadow-inner group-hover:scale-105 transition-transform">
                        <FileUp size={30} />
                      </div>
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold mb-2 uppercase tracking-wide">
                        File Picker
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                        Upload Form Image
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                        Drop Page B photo or select JPG/PNG from device
                      </p>
                    </div>

                    <div className="w-full">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          inputRef.current?.click();
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <FileUp size={14} /> Browse Photo Files
                      </button>
                    </div>
                    <input
                      ref={inputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => handleFile(event.target.files?.[0])}
                    />
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setStep('review')}
                    className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline cursor-pointer"
                  >
                    Or fill Page B form manually without photo →
                  </button>
                </div>
              </div>
            ) : (
            /* ── Step 2: Verification / Split View ──────────────────── */
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Extracting Loading Overlay / Banner */}
              {extracting && (
                <div className="bg-violet-600 text-white px-4 py-2.5 flex items-center justify-between text-xs font-medium shrink-0 animate-pulse shadow-md">
                  <div className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Scanning handwritten Page B form via AI Vision OCR... Reading table rows, tools &amp; shift values.</span>
                  </div>
                  <span className="text-[11px] opacity-90 hidden sm:inline">Please wait a moment</span>
                </div>
              )}

              {/* Extraction Success & Status Bar with View Mode Switcher */}
              <div className="bg-gradient-to-r from-violet-50/90 via-slate-50 to-indigo-50/70 dark:from-violet-950/40 dark:via-slate-900/60 dark:to-indigo-950/30 border-b border-slate-200 dark:border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <p className="text-xs text-slate-700 dark:text-slate-200 font-medium">
                    {viewMode === 'form' && (
                      <>
                        <strong className="text-violet-600 dark:text-violet-400 font-semibold">Page B Form View:</strong> Review and edit tool handover entries below. Click <strong>Compare with Photo</strong> to verify side-by-side.
                      </>
                    )}
                    {viewMode === 'compare' && (
                      <>
                        <strong className="text-amber-600 dark:text-amber-400 font-semibold">Side-by-Side Comparison:</strong> Compare uploaded form photo on left with editable cells on right.
                      </>
                    )}
                    {viewMode === 'photo' && (
                      <>
                        <strong className="text-violet-600 dark:text-violet-400 font-semibold">Photo View:</strong> Inspect original uploaded Page B sheet.
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
                          ? 'bg-violet-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                      }`}
                      title="View full editable Form B"
                    >
                      <FileText size={13} />
                      Form View
                    </button>

                    <button
                      type="button"
                      onClick={() => setViewMode('compare')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        viewMode === 'compare'
                          ? 'bg-violet-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                      }`}
                      title="Compare Page B photo side-by-side with editable sheet"
                    >
                      <Columns2 size={13} />
                      Compare with Photo
                    </button>

                    <button
                      type="button"
                      onClick={() => setViewMode('photo')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        viewMode === 'photo'
                          ? 'bg-violet-600 text-white shadow-sm'
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

              {/* Low Confidence Warning Alert */}
              {lowConfidenceFields.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-950/60 border-b border-amber-200 dark:border-amber-800 px-4 py-1.5 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-2 shrink-0">
                  <HelpCircle size={14} className="text-amber-600 shrink-0" />
                  <span>Some handwritten characters had low confidence: <strong>{lowConfidenceFields.join(', ')}</strong>. Please verify them.</span>
                </div>
              )}

              {/* Mobile Tab Toggle (Visible on screens < 640px) */}
              {imageUrl && (
                <div className="flex sm:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shrink-0 gap-2">
                  <button
                    onClick={() => setMobileTab('form')}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      mobileTab === 'form' ? 'bg-violet-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <FileEdit size={14} /> Edit Form Entries
                  </button>
                  <button
                    onClick={() => setMobileTab('photo')}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      mobileTab === 'photo' ? 'bg-violet-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Camera size={14} /> View Form Photo
                  </button>
                </div>
              )}

              {/* ── MAIN CONTENT AREA ────────────────────────── */}
              <div className="flex-1 overflow-hidden min-h-[400px] flex flex-col">

                {/* ── 1. DEFAULT: FORM VIEW ONLY (Full Width) ──── */}
                {viewMode === 'form' && (
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                          <FileEdit size={14} className="text-violet-600 dark:text-violet-400" /> Page B Form Data (Editable)
                        </h4>
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 font-semibold">
                          Live Editing Enabled
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {selectedFile && (
                          <button
                            type="button"
                            onClick={() => runExtraction()}
                            disabled={extracting}
                            className="text-[11px] px-2.5 py-1 rounded-lg bg-violet-100 dark:bg-violet-950 hover:bg-violet-200 text-violet-700 dark:text-violet-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <ScanLine size={13} /> {extracting ? 'Extracting...' : 'Scan and Fill Form'}
                          </button>
                        )}
                        {imageUrl && (
                          <button
                            type="button"
                            onClick={() => setViewMode('compare')}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/80 hover:bg-violet-100 dark:hover:bg-violet-900 border border-violet-200/80 dark:border-violet-800/80 shadow-sm transition-all cursor-pointer hover:scale-[1.02]"
                          >
                            <Columns2 size={13} />
                            <span>Compare with Photo</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar p-3 sm:p-5 bg-slate-50/60 dark:bg-slate-950/30">
                      <ToolHandoverSheet
                        records={records}
                        details={details}
                        onRecordChange={updateRecord}
                        onDetailsChange={updateDetails}
                        onSubmit={handleSubmit}
                        readOnly={false}
                      />
                    </div>
                  </div>
                )}

                {/* ── 2. COMPARE MODE: SIDE-BY-SIDE SPLIT ───────── */}
                {viewMode === 'compare' && (
                  <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-0 overflow-hidden">
                    {/* Photo Preview on Left */}
                    <div className={`border-r border-slate-200 dark:border-slate-800 flex-col overflow-hidden ${
                      mobileTab === 'photo' ? 'flex' : 'hidden xl:flex'
                    }`}>
                      <div className="bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Camera size={14} className="text-violet-600 dark:text-violet-400" /> Uploaded Page B Photo
                        </h4>
                        <div className="flex items-center gap-2">
                          {selectedFile && (
                            <button
                              type="button"
                              onClick={() => runExtraction()}
                              disabled={extracting}
                              className="text-[11px] px-2.5 py-1 rounded-lg bg-violet-100 dark:bg-violet-950 hover:bg-violet-200 text-violet-700 dark:text-violet-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <ScanLine size={13} /> {extracting ? 'Extracting...' : 'Scan and Fill Form'}
                            </button>
                          )}
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">Scroll to zoom</span>
                        </div>
                      </div>
                      <div className="flex-1 overflow-hidden flex flex-col p-1">
                        <ImagePreview imageUrl={imageUrl} />
                      </div>
                    </div>

                    {/* Editable Sheet on Right */}
                    <div className={`flex-col overflow-hidden ${
                      mobileTab === 'form' ? 'flex' : 'hidden xl:flex'
                    }`}>
                      <div className="bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <FileEdit size={14} className="text-violet-600 dark:text-violet-400" /> Page B Form Data (Editable)
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => setViewMode('form')}
                          className="text-[11px] font-semibold text-violet-600 dark:text-violet-300 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Maximize2 size={12} /> Full Form View
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto no-scrollbar p-2 sm:p-4 bg-slate-50/60 dark:bg-slate-950/30">
                        <ToolHandoverSheet
                          records={records}
                          details={details}
                          onRecordChange={updateRecord}
                          onDetailsChange={updateDetails}
                          onSubmit={handleSubmit}
                          readOnly={false}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── 3. PHOTO ONLY MODE ───────────────────────── */}
                {viewMode === 'photo' && (
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="bg-slate-50 dark:bg-slate-800/80 px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                        <Camera size={14} className="text-violet-600 dark:text-violet-400" /> Full Size Uploaded Page B Photo
                      </h4>
                      <button
                        type="button"
                        onClick={() => setViewMode('form')}
                        className="text-xs font-semibold text-violet-600 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/80 hover:bg-violet-100 dark:hover:bg-violet-900 border border-violet-200 dark:border-violet-800 px-3 py-1 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
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

              {/* Error message */}
              {error && (
                <div className="px-4 py-2 bg-red-50 dark:bg-red-950/60 border-t border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 font-medium flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={() => runExtraction()}
                      className="underline text-[11px] font-bold cursor-pointer"
                    >
                      Try OCR Again
                    </button>
                  )}
                </div>
              )}

              {/* Bottom Action Bar */}
              <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between shadow-lg shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReupload}
                    disabled={submitting || extracting}
                    className="btn-secondary text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw size={14} /> Re-upload Photo
                  </button>
                  {imageUrl && viewMode === 'form' && (
                    <button
                      type="button"
                      onClick={() => setViewMode('compare')}
                      className="btn-secondary text-xs hidden sm:flex items-center gap-1.5 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800 cursor-pointer"
                    >
                      <Columns2 size={13} /> Compare with Photo
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || extracting}
                  className="btn-success text-xs flex items-center gap-1.5 px-5 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Saving to Database...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      Confirm &amp; Submit Page B
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )}
  </>
  );
}
