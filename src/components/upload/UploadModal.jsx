import { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { uploadFormImage, submitProductionLog } from '../../services/api';
import { createEmptyFormData } from '../../types/models';
import VerificationView from './VerificationView';
import CameraCapture from './CameraCapture';
import { fillBlankValues, prepareFormImage } from './prepareFormImage';
import { X, Upload, Camera, FileUp, Image as ImageIcon, FileSearch, Loader2, Sparkles, Smartphone } from 'lucide-react';

export default function UploadModal({ onClose, onSubmitted }) {
  const { user } = useAuth();
  const fileRef = useRef(null);
  const nativeCameraRef = useRef(null);

  const [step, setStep] = useState('upload'); // 'upload' | 'camera' | 'processing' | 'verify'
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFile = async (file) => {
    if (!file) return;
    setErrorMessage('');
    const optimizedFile = await prepareFormImage(file);
    const url = URL.createObjectURL(optimizedFile);
    setImageFile(optimizedFile);
    setImageUrl(url);
    const blankForm = createEmptyFormData();
    blankForm.uploadedBy = user?.fullName || 'Operator';
    blankForm.uploadedById = String(user?.employeeId || user?.id || '');
    blankForm.entryPersonName = user?.fullName || 'Operator';
    blankForm.employeeId = user?.employeeId || '';
    blankForm.employeeNumbers = user?.employeeId || '';
    setFormData(blankForm);
    setStep('verify');
    setExtracting(true);

    try {
      const extracted = await uploadFormImage(optimizedFile);
      extracted.uploadedBy = user?.fullName || 'Operator';
      extracted.uploadedById = String(user?.employeeId || user?.id || '');
      extracted.entryPersonName = user?.fullName || 'Operator';
      if (user?.employeeId && !extracted.employeeNumbers) {
        extracted.employeeNumbers = user.employeeId;
        extracted.employeeId = user.employeeId;
      }
      setFormData(current => fillBlankValues(current || createEmptyFormData(), extracted));
      console.info('[Form A OCR] extracted review state', extracted);
    } catch (err) {
      console.error('OCR extraction failed:', err);
      setErrorMessage(err.message || 'We could not read values from this form. Please try again or fill the form manually.');
    } finally {
      setExtracting(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleReupload = () => {
    setStep('upload');
    setImageUrl(null);
    setImageFile(null);
    setFormData(null);
    setErrorMessage('');
  };

  const handleManualEntry = () => {
    const blankForm = createEmptyFormData();
    blankForm.uploadedBy = user?.fullName || 'Operator';
    blankForm.uploadedById = String(user?.employeeId || user?.id || '');
    blankForm.entryPersonName = user?.fullName || 'Operator';
    blankForm.employeeId = user?.employeeId || '';
    blankForm.employeeNumbers = user?.employeeId || '';
    setFormData(blankForm);
    setErrorMessage('');
    setStep('verify');
  };

  const handleSubmit = async () => {
    if (!formData || submitting) return;
    setSubmitting(true);
    setErrorMessage('');
    try {
      const submissionData = {
        ...formData,
        uploadedBy: user?.fullName || formData?.uploadedBy || 'Operator',
        uploadedById: String(user?.employeeId || user?.id || ''),
        entryPersonName: user?.fullName || formData?.entryPersonName || 'Operator',
        employeeId: user?.employeeId || formData?.employeeId || formData?.employeeNumbers || '',
        employeeNumbers: formData?.employeeNumbers || user?.employeeId || '',
      };
      console.info('[Form A comparison] values at Save click', submissionData);
      await submitProductionLog(submissionData);
      window.dispatchEvent(new Event('production-log-submitted'));
      onSubmitted?.();
    } catch (err) {
      console.error('Submit failed:', err);
      let msg = err.message || 'Failed to submit the form. Please try again.';
      if (msg.includes('UNIQUE constraint failed') || msg.includes('form_unique_id')) {
        msg = 'This form has already been uploaded with the same Form No. Please check your Form No. before uploading.';
      }
      setErrorMessage(msg);
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

      {/* Hidden Standard File Picker */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
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
            setTimeout(() => fileRef.current?.click(), 100);
          }}
        />
      ) : (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget && step !== 'processing') onClose(); }}>
          <div className={`modal-content flex flex-col ${step === 'verify' ? 'w-[95vw] h-[92vh] max-w-full' : 'w-full max-w-2xl'}`}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                {step === 'upload' && <Upload size={20} className="text-indigo-600 dark:text-indigo-400" />}
                {step === 'processing' && <Loader2 size={20} className="text-indigo-600 dark:text-indigo-400 animate-spin" />}
                {step === 'verify' && <FileSearch size={20} className="text-indigo-600 dark:text-indigo-400" />}
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {step === 'upload' && 'Upload Hourly Production Sheet (Page A)'}
                    {step === 'processing' && 'Reading Form...'}
                    {step === 'verify' && 'Verify Extracted Sheet Data'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {step === 'upload' && 'Capture with camera or select a photo from your device'}
                    {step === 'processing' && 'Extracting header, hourly grid, and TPM values'}
                    {step === 'verify' && 'Review and edit extracted values before saving'}
                  </p>
                </div>
              </div>
              {step !== 'processing' && (
                <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer" aria-label="Close">
                  <X size={18} />
                </button>
              )}
            </div>

            {/* ── Step: Upload (Two Clear Options) ──────────────────────────── */}
            {step === 'upload' && (
              <div className="p-6 space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300 text-xs font-medium">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Option 1: Take Photo / Open Camera */}
                  <div
                    className="group relative flex flex-col items-center justify-between p-6 sm:p-7 rounded-2xl border-2 border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/70 to-indigo-100/30 dark:from-indigo-950/40 dark:to-indigo-900/20 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-200 text-center"
                  >
                    <div
                      onClick={() => setStep('camera')}
                      className="flex flex-col items-center w-full cursor-pointer"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-3 shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                        <Camera size={30} />
                      </div>
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold mb-2 uppercase tracking-wide">

                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                        Take Photo / Camera
                      </h4>

                    </div>

                    <div className="w-full space-y-2">
                      <button
                        type="button"
                        onClick={() => setStep('camera')}
                        className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <Camera size={15} /> Open Live Camera
                      </button>

                    </div>
                  </div>

                  {/* Option 2: Upload File */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                    className={`group relative flex flex-col items-center justify-between p-6 sm:p-7 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer text-center ${dragActive
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40'
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
                        Upload File
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                        Drop your image here or browse JPG, PNG, HEIC from device
                      </p>
                    </div>

                    <div className="w-full">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileRef.current?.click();
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <Upload size={14} /> Browse Files
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-center pt-1">
                  <button type="button" onClick={handleManualEntry} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                    Fill Page A form manually without a photo →
                  </button>
                </div>
              </div>
            )}

            {/* ── Step: Processing ─────────────────────── */}
            {step === 'processing' && (
              <div className="p-12 flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-indigo-100 dark:border-indigo-950 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileSearch size={24} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">Reading form and extracting values...</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Identifying Page A and mapping the header, hourly grid, and TPM table</p>
                </div>
                {/* Fake progress bar */}
                <div className="w-64 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full animate-pulse" style={{ width: '75%' }} />
                </div>
              </div>
            )}

            {/* ── Step: Verification ───────────────────── */}
            {step === 'verify' && formData && (
              <div className="flex-1 overflow-hidden">
                <VerificationView
                  imageUrl={imageUrl}
                  formData={formData}
                  onChange={setFormData}
                  onReupload={handleReupload}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                  extracting={extracting}
                  errorMessage={errorMessage}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
