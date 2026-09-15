import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, X, Check, AlertCircle, Sparkles, Upload, Smartphone, FlipHorizontal } from 'lucide-react';

export default function CameraCapture({ onCapture, onClose, onSwitchToFile }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const nativeCameraInputRef = useRef(null);

  const [mediaStream, setMediaStream] = useState(null);
  const [hasPermission, setHasPermission] = useState(null); // null (loading) | true | false
  const [errorMessage, setErrorMessage] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedBlob, setCapturedBlob] = useState(null);
  const [devices, setDevices] = useState([]);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'
  const [flash, setFlash] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Stop camera tracks helper
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      } catch (e) {
        console.warn('Error stopping camera tracks:', e);
      }
      streamRef.current = null;
    }
    setMediaStream(null);
  }, []);

  // Initialize camera stream with robust fallback
  const startCamera = useCallback(async (deviceId = null, preferredFacing = facingMode) => {
    stopCamera();
    setIsLoading(true);
    setErrorMessage('');
    setHasPermission(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasPermission(false);
      setErrorMessage('Direct Camera API is not supported on this browser. Please use the "Phone Camera" or "Upload File" option.');
      setIsLoading(false);
      return;
    }

    let stream = null;

    // Constraint attempt 1: High definition with preferred facing mode or deviceId
    try {
      let constraints;
      if (deviceId) {
        constraints = {
          video: {
            deviceId: { exact: deviceId },
            width: { ideal: 1920, min: 1280 },
            height: { ideal: 1080, min: 720 },
          },
          audio: false,
        };
      } else {
        constraints = {
          video: {
            facingMode: { ideal: preferredFacing },
            width: { ideal: 1920, min: 1280 },
            height: { ideal: 1080, min: 720 },
          },
          audio: false,
        };
      }
      stream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err1) {
      console.warn('High-def camera constraint failed, trying standard facing mode:', err1);
      // Constraint attempt 2: Standard facing mode
      try {
        const fallbackConstraints = deviceId
          ? { video: { deviceId }, audio: false }
          : { video: { facingMode: preferredFacing }, audio: false };
        stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
      } catch (err2) {
        console.warn('Facing mode constraint failed, trying generic video:', err2);
        // Constraint attempt 3: Generic video
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        } catch (err3) {
          console.error('All camera constraints failed:', err3);
          setHasPermission(false);
          if (err3.name === 'NotAllowedError' || err3.name === 'PermissionDeniedError') {
            setErrorMessage('Camera access was denied. Please allow camera permissions in your browser address bar/settings, or use the "Phone Camera / File" option below.');
          } else if (err3.name === 'NotFoundError' || err3.name === 'DevicesNotFoundError') {
            setErrorMessage('No camera device detected. Please connect a camera or use the file upload option.');
          } else if (err3.name === 'NotReadableError' || err3.name === 'TrackStartError') {
            setErrorMessage('Camera is currently in use by another application. Please close other camera apps and retry.');
          } else {
            setErrorMessage(`Unable to access camera: ${err3.message || 'Unknown error'}`);
          }
          setIsLoading(false);
          return;
        }
      }
    }

    if (stream) {
      streamRef.current = stream;
      setMediaStream(stream);
      setHasPermission(true);

      // Attach immediately if videoRef is already mounted
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((playErr) => {
          console.warn('Camera video auto-play was prevented:', playErr);
        });
      }

      // Enumerate camera devices for multi-camera support
      try {
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = allDevices.filter((d) => d.kind === 'videoinput');
        setDevices(videoInputs);
      } catch {
        // ignore device listing error
      }
    }

    setIsLoading(false);
  }, [stopCamera, facingMode]);

  // Keep video element connected to stream whenever stream or video element updates
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      if (videoRef.current.srcObject !== mediaStream) {
        videoRef.current.srcObject = mediaStream;
      }
      videoRef.current.play().catch((err) => {
        console.warn('Video play catch:', err);
      });
    }
  }, [mediaStream]);

  // Initial camera startup
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // Flip/Switch camera device
  const handleSwitchCamera = () => {
    if (devices.length > 1) {
      const nextIndex = (currentDeviceIndex + 1) % devices.length;
      setCurrentDeviceIndex(nextIndex);
      startCamera(devices[nextIndex].deviceId);
    } else {
      // Toggle facingMode if device enumeration doesn't show multiple devices
      const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
      setFacingMode(nextFacing);
      startCamera(null, nextFacing);
    }
  };

  // Capture current video frame
  const handleTakePhoto = async () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    
    // Trigger visual flash animation
    setFlash(true);
    setTimeout(() => setFlash(false), 200);

    // Try ImageCapture API first (Chromium / Mobile Chrome support for native high-res photo)
    let photoBlob = null;
    try {
      const track = mediaStream?.getVideoTracks()?.[0];
      if (track && 'ImageCapture' in window) {
        // @ts-ignore
        const imageCapture = new window.ImageCapture(track);
        if (imageCapture.takePhoto) {
          photoBlob = await imageCapture.takePhoto();
        }
      }
    } catch (e) {
      console.warn('Native ImageCapture not available, falling back to Canvas draw:', e);
    }

    if (photoBlob) {
      const file = new File([photoBlob], `form-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
      const previewUrl = URL.createObjectURL(photoBlob);
      setCapturedBlob(file);
      setCapturedImage(previewUrl);
      stopCamera();
      return;
    }

    // Canvas fallback
    const canvas = canvasRef.current || document.createElement('canvas');
    const width = video.videoWidth || 1920;
    const height = video.videoHeight || 1080;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const file = new File([blob], `form-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
          const previewUrl = URL.createObjectURL(blob);
          setCapturedBlob(file);
          setCapturedImage(previewUrl);
          stopCamera();
        },
        'image/jpeg',
        0.95
      );
    }
  };

  // Retake photo
  const handleRetake = () => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
    }
    setCapturedImage(null);
    setCapturedBlob(null);
    startCamera(devices[currentDeviceIndex]?.deviceId || null);
  };

  // Confirm photo
  const handleConfirmPhoto = () => {
    if (capturedBlob) {
      stopCamera();
      onCapture?.(capturedBlob);
    }
  };

  // Handle native camera input (Phone Camera file input)
  const handleNativeCameraFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      stopCamera();
      onCapture?.(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-3xl max-h-[94vh] bg-slate-900 text-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-700/80 overflow-hidden">
        
        {/* Hidden Native Camera Input */}
        <input
          ref={nativeCameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleNativeCameraFile}
        />

        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-950/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 flex items-center justify-center">
              <Camera size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                {capturedImage ? 'Review Captured Photo' : 'Capture Form Sheet Photo'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {capturedImage ? 'Ensure form numbers and tables are clear & readable' : 'Align sheet inside the frame and tap capture'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close camera"
          >
            <X size={18} />
          </button>
        </div>

        {/* Viewfinder / Preview Area */}
        <div className="relative flex-1 bg-black min-h-[300px] sm:min-h-[440px] max-h-[66vh] flex items-center justify-center overflow-hidden">
          {/* Flash animation */}
          {flash && <div className="absolute inset-0 bg-white z-40 pointer-events-none transition-opacity duration-200" />}

          {/* Hidden Canvas */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Camera Loading Overlay */}
          {isLoading && !capturedImage && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-slate-950/95">
              <div className="w-10 h-10 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              <p className="text-xs text-slate-300 font-medium">Starting camera stream...</p>
            </div>
          )}

          {/* Camera Error / Permission Denied Overlay */}
          {hasPermission === false && !capturedImage && (
            <div className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-slate-950/95">
              <div className="text-center max-w-md space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto shadow-inner">
                  <AlertCircle size={28} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Camera Access Needed</h4>
                  <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">{errorMessage}</p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => startCamera()}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw size={14} /> Retry Camera
                  </button>
                  <button
                    type="button"
                    onClick={() => nativeCameraInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-indigo-600/30"
                  >
                    <Smartphone size={14} /> Use Phone Camera App
                  </button>
                  {onSwitchToFile && (
                    <button
                      type="button"
                      onClick={() => {
                        stopCamera();
                        onSwitchToFile();
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Upload size={14} /> Choose File
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Live Video Stream View */}
          <div className={`relative w-full h-full flex items-center justify-center bg-black ${capturedImage ? 'hidden' : 'flex'}`}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-contain"
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  videoRef.current.play().catch(() => {});
                }
              }}
            />

            {/* Viewfinder Alignment Overlay */}
            {hasPermission && (
              <div className="absolute inset-4 sm:inset-8 border border-white/20 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-t-2 border-l-2 border-indigo-400 rounded-tl-lg" />
                  <div className="w-6 h-6 border-t-2 border-r-2 border-indigo-400 rounded-tr-lg" />
                </div>
                <div className="text-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-medium text-slate-200 border border-white/10 shadow-lg">
                    <Sparkles size={12} className="text-indigo-400" /> Hold steady &amp; align entire sheet
                  </span>
                </div>
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-b-2 border-l-2 border-indigo-400 rounded-bl-lg" />
                  <div className="w-6 h-6 border-b-2 border-r-2 border-indigo-400 rounded-br-lg" />
                </div>
              </div>
            )}
          </div>

          {/* Captured Image Review Screen */}
          {capturedImage && (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <img
                src={capturedImage}
                alt="Captured form"
                className="w-full h-full object-contain max-h-[62vh]"
              />
            </div>
          )}
        </div>

        {/* Bottom Action / Control Bar */}
        <div className="px-4 sm:px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          {!capturedImage ? (
            <>
              {/* Left Action: Flip Camera */}
              <div className="w-28 flex items-center justify-start">
                <button
                  type="button"
                  onClick={handleSwitchCamera}
                  className="p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Flip camera"
                >
                  <FlipHorizontal size={15} />
                  <span className="hidden sm:inline">Flip</span>
                </button>
              </div>

              {/* Center Shutter Button */}
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleTakePhoto}
                  disabled={isLoading || hasPermission === false}
                  className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-white text-slate-900 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Take photo"
                  title="Capture photo"
                >
                  <div className="w-13 h-13 rounded-full border-2 border-slate-900 group-hover:border-indigo-600 flex items-center justify-center transition-colors">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 group-hover:bg-indigo-500 transition-colors shadow-inner" />
                  </div>
                </button>
              </div>

              {/* Right Action: Phone Camera App & File picker fallback */}
              <div className="w-28 flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => nativeCameraInputRef.current?.click()}
                  className="p-2.5 rounded-xl bg-indigo-950/80 border border-indigo-800/60 hover:bg-indigo-900 text-indigo-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Open native camera app"
                >
                  <Smartphone size={15} />
                  <span className="hidden sm:inline">Phone App</span>
                </button>
              </div>
            </>
          ) : (
            /* Review Actions */
            <div className="w-full flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleRetake}
                className="px-4 sm:px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw size={15} /> Retake Photo
              </button>

              <button
                type="button"
                onClick={handleConfirmPhoto}
                className="px-5 sm:px-7 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/30 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Check size={16} /> Use This Photo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
